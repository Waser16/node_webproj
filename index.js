const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
let session = require('express-session');
const mysql = require('mysql2');
const ejs = require('ejs');
const express = require('express');
const url = require("node:url");
const app = express();
const urlParser = bodyParser.urlencoded({extended: false,});

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '/public/images'))
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})
const images = multer({storage: storage});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json({limit: '2000kb'}));
app.use('/photos', express.static(path.join(__dirname, '/public/images')));
app.use('/styles', express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    secret: 'secret',
    cookie: {maxAge: 900000},
    resave: true,
    saveUninitialized: false
}));


/* СТРАНИЦА АВТОРИЗАЦИИ */
app.get('/auth', function(req, res) {
    // console.log(req.session);
    let headerPath = path.join(__dirname, '/views/header.ejs');
    let footerPath = path.join(__dirname, '/views/footer.ejs');
    let sendData = {
        header: headerPath,
        footer: footerPath,
        userId: req.session.userId,
        position: req.session.position,
    };
    res.render('auth.ejs', sendData);
});

app.post('/auth/test', urlParser, function(req, res) {
    let email = req.body.email;
    let password =  req.body.password;
    let q = "SELECT * FROM `staff` WHERE `email`=? AND `password`=?";
    connection.query(q, [email, password], function(err, result, fields) {
        if (result.length == 1) {
            req.session.userId = result[0].id;
            req.session.position = result[0].position;
            console.log(req.session);

            let sendData = {
                status_code: 1,
                message: 'Вы успешно авторизовались!',
                result: result
            }
            res.status(200).send(sendData);
        }
    })
});



/* LOGOUT */
app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});


/* СТРАНИЦА РЕГИСТРАЦИИ */
app.get('/register', function(req, res) {
    let headerPath = path.join(__dirname, '/views/header.ejs');
    let footerPath = path.join(__dirname, '/views/footer.ejs');
    let sendData = {
        header: headerPath,
        footer: footerPath,
        userId: req.session.userId,
        position: req.session.position,
    };
    res.render('register.ejs', sendData);
});
app.put('/register', urlParser, function(req, res) {
    // console.log(req.session);
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let login = req.body.login;
    let password = req.body.password;
    console.log(first_name, last_name, email, password, login);
    let q = "INSERT INTO `users` (`last_name`, `first_name`, `login`, `email`, `password`) VALUES (?,?,?,?,?)";
    let values = [last_name, first_name, login, email, password];
    connection.query(q, values, function(err, result, fields) {
        if (err) {
            console.log(err);
            let sendData = {
                status_code: 0,
                message: 'Ошибка регистрации!'
            }
            res.status(200).json(sendData);
        } else {
            console.log(result);
            let sendData = {
                status_code: 200,
                message: 'Регистрация прошла успешно!'
            }
            res.redirect('/');
            // res.status(200).json(sendData);
        }
    })
})



/* АДМИНКА - ГЛАВНАЯ СТРАНИЦА */
app.get('/admin', function(req, res) {
    // console.log(req.session);
    if (!req.session.userId) {
        res.redirect('/');
    }
    let postsQ = "";
    if (req.session.position == 'админ') {
        postsQ = `SELECT p.image_path, p.id, p.title, p.post_date, s.first_name, s.last_name
                    FROM posts p
                    JOIN staff s on p.author = s.id
                ORDER BY post_date DESC
                `;
    }
    else {
        postsQ = `SELECT p.image_path, p.id, p.title,
                        p.post_date, s.first_name,
                        s.last_name 
                FROM posts p
                        JOIN staff s on p.author = s.id 
                WHERE p.author=${req.session.userId}  
                ORDER BY post_date DESC `;
    }
    connection.query(postsQ, function(err, posts, fields) {
        // console.log(err, posts);

        let statsQ = `SELECT COUNT(*) AS cnt,
                                MAX(post_date) as latest_post,
                                s.last_name, s.first_name
                            FROM posts p
                                JOIN staff s on p.author = s.id
                            WHERE author = ${req.session.userId}`;
        connection.query(statsQ, function(err, stats, fields) {
            // console.log(stats);
            let headerPath = path.join(__dirname, '/views/header.ejs');
            let footerPath = path.join(__dirname, '/views/footer.ejs');
            let sendData = {
                header: headerPath,
                footer: footerPath,
                userId: req.session.userId,
                position: req.session.position,
                posts: posts,
                stats: stats
            };
            res.status(200).render('admin.ejs', sendData);
        })
    })
})

/* АДМИНКА - УДАЛЕНИЕ СТАТЬИ */
app.delete('/admin/delete/', urlParser, function(req, res) {
    console.log('ЗАШЕЛ в /admin/delete');
    // console.log(req.body);
    let id = req.body.post_id;
    let q = `DELETE FROM posts WHERE id =?`;
    connection.query(q, [id], function(err, result, fields) {
        if (err) {
            console.log(err);
            let rawTime = new Date();
            let time = rawTime.getFullYear() + '-' + (rawTime.getMonth() + 1) + '-' + rawTime.getDate();
            let sendData = {
                status_code: 0,
                message: 'Ошибка удаления статьи!',
                delete_time: time
            }
            res.status(200).json(sendData);
        } else {
            console.log(result);
            let rawTime = new Date();
            let time = rawTime.getFullYear() + '-' + (rawTime.getMonth() + 1) + '-' + rawTime.getDate();
            let sendData = {
                status_code: 1,
                message: 'Статья успешно удалена!',
                delete_time: time
            }
            res.status(200).json(sendData);
            // res.status(200).redirect('/admin');
        }
    })
})


/* АДМИНКА - ДОБАВЛЕНИЕ СТАТЬИ */
app.get('/admin/create', urlParser, function(req, res) {
    let statsQ = `SELECT COUNT(*) AS cnt,
                                MAX(post_date) as latest_post,
                                s.last_name, s.first_name
                            FROM posts p
                                JOIN staff s on p.author = s.id
                            WHERE author = ${req.session.userId}`;
    connection.query(statsQ, function(err, stats, fields) {
        // console.log(stats);
        let headerPath = path.join(__dirname, '/views/header.ejs');
        let footerPath = path.join(__dirname, '/views/footer.ejs');
        let sendData = {
            header: headerPath,
            footer: footerPath,
            userId: req.session.userId,
            position: req.session.position,
            stats: stats
        };
        res.status(200).render('admin_create.ejs', sendData);
    })
})
app.post('/admin/create', images.single('image'), function(req, res) {

    // console.log(req.file);
    // console.log(req.body);
    let title = req.body.post_title;
    let imageName = req.file.originalname;
    let postText = req.body.post_text;
    let author = req.body.author_id;
    let important = req.body.important;
    let rawDate = new Date();
    let date = rawDate.getFullYear() + '-'
        + ('0' + (rawDate.getMonth() + 1)).slice(-2) + '-'
        + rawDate.getDate();
    console.log(title, imageName, postText, author, important, date);
    let q = `INSERT INTO posts (title, post_date, image_path, post_text, author,important)
                    VALUES (?,?,?,?,?,?)`;
    let values = [title, date, imageName, postText, author, important];
    connection.query(q, values, function(err, result, fields) {
        console.log(err, result);
        if (err) {
            console.log(err);
            let sendData = {
                status_code: 0,
                message: 'Ошибка добавления статьи!'
            }
            res.status(200).json(sendData);
        }
        else {
            console.log(result);
            let sendData = {
                status_code: 1,
                message: 'Статья успешно добавлена!'
            }
            res.status(200).json(sendData);
            // res.status(200).redirect('/admin');
        }
    })
})

/* АДМИНКА - РЕДАКТИРОВАНИЕ СТАТЬИ */
app.get('/admin/red/:id', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/');
    }
    console.log('ЗАШЕЛ в /admin/red/:id');
    console.log(`Сессия: ${req.session.userId}`);
    let postId = req.params.id;
    let q = `SELECT * FROM posts WHERE id =?`;
    connection.query(q, [postId], function(err, post, fields) {
        let statsQ = `SELECT COUNT(*) AS cnt,
                                MAX(post_date) as latest_post,
                                s.last_name, s.first_name
                            FROM posts p
                                JOIN staff s on p.author = s.id
                            WHERE author=?`;
        let authorId = req.session.userId;
        connection.query(statsQ, [authorId], function(err, stats, fields) {
            // console.log(post[0], stats);
            let headerPath = path.join(__dirname, '/views/header.ejs');
            let footerPath = path.join(__dirname, '/views/footer.ejs');
            post[0].post_text = post[0].post_text.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
            let sendData = {
                header: headerPath,
                footer: footerPath,
                userId: req.session.userId,
                position: req.session.position,
                post: post[0],
                stats: stats[0]
            };
            // console.log(sendData);
            res.status(200).render('admin_update.ejs', sendData);
        })
    })
})
app.post('/admin/red', images.single('image'), function (req, res) {
    console.log('Зашел в POST /admin/red', req.session);
    // console.log(req.body);
    // console.log(req.file);

    let postId = req.body.post_id;
    let postTitle = req.body.post_title;
    let image = req.file.originalname;
    let postText = req.body.post_text;
    let author = req.session.userId;
    let important = req.body.important;
    let rawDate = new Date();
    let date = rawDate.getFullYear() + '-'
        + ('0' + (rawDate.getMonth() + 1)).slice(-2) + '-'
        + rawDate.getDate();

    console.log(postId, postTitle, date, image, postText, author, important)
    let q = `UPDATE posts SET title=?, post_date=?, image_path=?, post_text=?, author=?, important=? WHERE id=?`;
    let values = [postTitle, date, image, postText, author, important, postId];
    connection.query(q, values, function(err, result, fields) {
        console.log(err, result);
        if (err) {
            console.log(err);
            let sendData = {
                status_code: 0,
                message: 'Ошибка редактирования статьи!',
                post_title: postTitle,
                upd_time: date
            }
            res.status(200).json(sendData);
        }
        else {
            console.log(result);
            let sendData = {
                status_code: 1,
                message: 'Статья успешно отредактирована!',
                post_title: postTitle,
                upd_time: date
            }
            res.status(200).json(sendData);
        }
    })
})


/* АДМИНКА СТАФФА - ГЛАНАЯ */
app.get('/admin/staff', function(req, res) {
    // console.log(req.session);
    if (!req.session.userId || req.session.position != 'админ') {
        res.redirect('/admin');
    }
    let staffQ = "SELECT * FROM staff";
    connection.query(staffQ, function(err, staff, fields) {
        let statsQ = `SELECT COUNT(*) AS cnt,
                                MAX(post_date) as latest_post,
                                s.last_name, s.first_name
                            FROM posts p
                                JOIN staff s on p.author = s.id
                            WHERE author=?`;
        let authorId = req.session.userId;
        connection.query(statsQ, [authorId], function(err, stats, fields) {
            // console.log(staff, stats);
            let headerPath = path.join(__dirname, '/views/header.ejs');
            let footerPath = path.join(__dirname, '/views/footer.ejs');
            let sendData = {
                header: headerPath,
                footer: footerPath,
                userId: req.session.userId,
                position: req.session.position,
                staff: staff,
                stats: stats[0]
            };
            res.status(200).render('admin_staff.ejs', sendData);
        })
        
    })
})

/* АДМИНКА СТАФФА - УДАЛЕНИЕ СТАФФА */
app.delete('/admin/staff/delete/:id', function(req, res) {
    console.log('ЗАШЕЛ В DELETE /admin/staff/delete/:id');
    let staffId = req.params.id;
    console.log(staffId);
    let q = `DELETE FROM staff WHERE id =?`;
    connection.query(q, [staffId], function(err, result, fields) {
        console.log(err, result);
        if (err) {
            console.log(err);
            let sendData = {
                status_code: 0,
                message: 'Ошибка удаления сотрудника!'
            }
            res.status(200).json(sendData);
        }
        else {
            console.log(result);
            let sendData = {
                status_code: 1,
                message: 'Сотрудник успешно удален!'
            }
            res.status(200).json(sendData);
        }
    })
})


/* ГЛАВНАЯ СТРАНИЦА */
app.get('/', function(req, res) {
    // console.log(req.session);
    let sendData = {};
    let postsQ = `SELECT p.image_path, p.id, p.title,
                            p.post_date, s.first_name,
                            s.last_name
                        FROM posts p
                        JOIN staff s on p.author = s.id
                        ORDER BY post_date DESC
                        LIMIT 20`;
    connection.query(postsQ, function(err, posts, fields) {
        // console.log(posts);
        connection.query('SELECT * FROM `posts` WHERE important=1 ORDER BY `post_date` DESC LIMIT 3', function(err, importantPosts, fields) {
            // console.log(importantPosts);
            let headerPath = path.join(__dirname, '/views/header.ejs');
            let footerPath = path.join(__dirname, '/views/footer.ejs');
            sendData.header = headerPath;
            sendData.posts = posts;
            sendData.importantPosts = importantPosts;
            sendData.footer = footerPath;
            sendData.userId = req.session.userId;
            sendData.position = req.session.position;

            res.status(200).render('index.ejs', sendData);
        })
    })
})


/* СТРАНИЦА ОТДЕЛЬНОЙ СТАТЬИ  */
app.get('/post/:id', function(req, res) {
    let postId = req.params.id;
    // console.log(postId);
    let postQ = `SELECT p.image_path, p.id, p.title,
                            p.post_date, s.first_name,
                            s.last_name, p.post_text
                        FROM posts p
                        JOIN staff s on p.author = s.id
                        WHERE p.id =?`;
    connection.query(postQ, [postId], function(err, post, fields) {
        let importantPostsQ = 'SELECT * FROM `posts` WHERE important=1 ORDER BY `post_date` DESC LIMIT 3';
        connection.query(importantPostsQ, function (err, importantPosts, fields) {
            // console.log(post);
            let headerPath = path.join(__dirname, '/views/header.ejs');
            let footerPath = path.join(__dirname, '/views/footer.ejs');
            let sendData = {
                header: headerPath,
                post: post,
                importantPosts: importantPosts,
                footer: footerPath,
                userId: req.session.userId,
                position: req.session.position,
            };
            res.status(200).render('post.ejs', sendData);
        })
    })
})


/* КАЛЕНДАРЬ ЧЕМПИОНАТА */
app.get('/calendar', function(req, res) {
    // console.log(req.session, req.session.userId);
    let importantPostsQ = 'SELECT * FROM `posts` WHERE important=1 ORDER BY `post_date` DESC LIMIT 3';
    connection.query(importantPostsQ, function (err, importantPosts, fields) {
        // console.log(post);
        let headerPath = path.join(__dirname, '/views/header.ejs');
        let footerPath = path.join(__dirname, '/views/footer.ejs');
        let userId = req.session.userId;
        let position = req.session.position;
        let sendData = {
            header: headerPath,
            importantPosts: importantPosts,
            footer: footerPath,
            userId: userId,
            position: position,
        };
        res.status(200).render('calendar.ejs', sendData);
    })
})


/* СОСТАВЫ КОМАНД */
app.get('/teams', function(req, res) {
    let importantPostsQ = 'SELECT * FROM `posts` WHERE important=1 ORDER BY `post_date` DESC LIMIT 3';
    connection.query(importantPostsQ, function (err, importantPosts, fields) {
        // console.log(post);
        let headerPath = path.join(__dirname, '/views/header.ejs');
        let footerPath = path.join(__dirname, '/views/footer.ejs');
        let sendData = {
            header: headerPath,
            importantPosts: importantPosts,
            footer: footerPath,
            userId: req.session.userId,
            position: req.session.position,
        };
        res.status(200).render('teams.ejs', sendData);
    })
})


/* СТРАНИЦА 404 */
app.use(function(req, res, next) {
    res.status(404).render('error.ejs');
});


/* ПОДКЛЮЧЕНИЕ К БД И ЗАПУСК СЕРВЕРА*/
const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node_webproj',
    password: '',
});

connection.connect(function(err){
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(`Соединение с БД установлено`);
    }
});

app.listen(3000, function() {
    console.log("Сервер запущен");
})