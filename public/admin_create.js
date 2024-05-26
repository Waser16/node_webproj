$(document).ready( function () {
    console.log('test works');

    $('input[type=button]').click(function () {
        let postTitle = $('[name=post-title]').val();
        let fileInput = $('[name=pic-path]')[0];
        let picPath = fileInput.files[0];
        let isImportant = $('[name=important]').val();
        let postText = $('[name=post-text]').val();
        let splitText = postText.split('\n');

        for(let i = 0; i < splitText.length; i++) {
            splitText[i] = `<p>${splitText[i]}</p>`;
        }
        postText = splitText.join('');

        let authorId = $('[name=author_id]').val();

        if (!postTitle || !picPath || !isImportant || !postText || !authorId) {
            let errorMessage = 'Вы не до конца заполнили форму!';
            $('#ajax-status').html(`<p>${errorMessage}</p>`);
            return
        }

        // let data = {
        //     post_title: postTitle,
        //     pic_path: picPath,
        //     important: isImportant,
        //     post_text: postText,
        //     author_id: authorId
        // }

        let data = new FormData();
        data.append('post_title', postTitle);
        data.append('pic_path', picPath);
        data.append('important', isImportant);
        data.append('post_text', postText);
        data.append('author_id', authorId);

        console.log(postTitle, picPath, isImportant, postText);

        $.ajax({
            url: '/admin/create',
            method: 'POST',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.status_code) {
                    let successHtml = `
                        <p><u>Статус</u>: ${data.status}</p>
                        <p><u>Название статьи</u>: ${data.post_title}</p>
                        <p><u>Дата добавления</u>: ${data.add_datetime}</p>
                        <p><u>Длина статьи</u>: ${data.post_len} символов</p>
                    `;
                    $('#ajax-status').html(successHtml);
                    $('.hidden-div-ajax').show();
                    $('.create form').fadeOut();
                }
                else {
                    let errHtml = `
                        <p><u>Статус</u>: ${data.status}</p>
                        <p><u>Название статьи</u>: ${data.post_title}</p>
                        <p><u>Дата попытки операции</u>: ${data.add_datetime}</p>
                    `;
                    $('#ajax-status').html(errHtml);
                }
            }
        })
    })
});
