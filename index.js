const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql2');
const ejs = require('ejs');
const express = require('express');
const app = express();
const urlParser = bodyParser.urlencoded({extended: false,});
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/photos', express.static(path.join(__dirname, '/public/images')));
app.use('/styles', express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public')));


/* ГЛАВНАЯ СТРАНИЦА */
app.get('/', function(req, res) {
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

            res.status(200).render('index.ejs', sendData);
        })
    })
})
app.get('/post/:id', function(req, res) {
    let postId = req.params.id;
    console.log(postId);
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
            };
            res.status(200).render('post.ejs', sendData);
        })
    })
})

/* КАЛЕНДАРЬ ЧЕМПИОНАТА */
app.get('/calendar', function(req, res) {
    let importantPostsQ = 'SELECT * FROM `posts` WHERE important=1 ORDER BY `post_date` DESC LIMIT 3';
    connection.query(importantPostsQ, function (err, importantPosts, fields) {
        // console.log(post);
        let headerPath = path.join(__dirname, '/views/header.ejs');
        let footerPath = path.join(__dirname, '/views/footer.ejs');
        let sendData = {
            header: headerPath,
            importantPosts: importantPosts,
            footer: footerPath,
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
        };
        res.status(200).render('teams.ejs', sendData);
    })
})


/* СТРАНИЦА АВТОРИЗАЦИИ */
app.get('/auth', function(req, res) {
    let headerPath = path.join(__dirname, '/views/header.ejs');
    let footerPath = path.join(__dirname, '/views/footer.ejs');
    let sendData = {
        header: headerPath,
        footer: footerPath,
    };
    res.render('auth.ejs', sendData);
})



/* СТРАНИЦА РЕГИСТРАЦИИ */
app.get('/register', function(req, res) {
    let headerPath = path.join(__dirname, '/views/header.ejs');
    let footerPath = path.join(__dirname, '/views/footer.ejs');
    let sendData = {
        header: headerPath,
        footer: footerPath,
    };
    res.render('register.ejs', sendData);
})



/* СТРАНИЦА 404 */
app.use(function(req, res, next) {
    res.status(404).render('error.ejs');
})


/* ПОДКЛЮЧЕНИЕ К БД И ЗАПУСК СЕРВЕРА*/
const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'web_project',
    password: '',
});
connection.connect(function(err){
    if (err) {
        return console.log(err.message);
    } else {
        console.log(`Соединение с БД установлено`);
    }
});

app.listen(3000, function() {
    console.log("Сервер запущен");
});