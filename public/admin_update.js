$(document).ready(function() {
    let postId = $('[name=post-id]').val();
    let picInput = $('[name=pic-path]');
    let oldPicPath = picInput.data('path');
    let oldPostTitle = $('[name=post-title]').text();
    let oldImportance = $('input[name=important]:checked').val();
    let oldPostText = $('[name=post-text]').text();

    console.log(picInput, oldPicPath, oldPostTitle, oldImportance, oldPostText);

    $('.post-submit').click(function () {
        console.log('button listener');
        let image = $('[name=pic-path]')[0].files[0];
        let newPostTitle = $('[name=post-title]').val();
        let newImportance = $('input[name=important]:checked').val();
        let newPostText = $('[name=post-text]').val();
        let splitText = newPostText.split('\n');

        for(let i = 0; i < splitText.length; i++) {
            splitText[i] = `<p>${splitText[i]}</p>`;
        }
        newPostText = splitText.join('');

        console.log(image, newPostTitle, newImportance, newPostText);

        if (!image || !newPostTitle || !newImportance || !newPostText) {
            let errorMessage = 'Вы не до конца заполнили форму!';
            $('#ajax-status').html(`<p>${errorMessage}</p>`);
            return
        }

        let formData = new FormData();
        formData.append('post_id', postId);
        formData.append('post_title', newPostTitle);
        formData.append('post_text', newPostText);
        formData.append('important', newImportance);
        formData.append('image', image)

        fetch('/admin/red', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status_code == 1) {
                    // let successHtml = `
                    //     <p><u>Статус</u>: ${data.message}</p>
                    //     <p><u>Название статьи</u>: ${data.post_title}</p>
                    //     <p><u>Дата добавления</u>: ${data.upd_time}</p>
                    // `;
                    // $('#ajax-status').html(successHtml)
                    window.location.assign('/admin');
                }
                else {
                    let errHtml = `
                        <p><u>Статус</u>: ${data.message}</p>
                        <p><u>Название статьи</u>: ${data.post_title}</p>
                        <p><u>Дата попытки операции</u>: ${data.upd_time}</p>
                    `;
                    $('#ajax-status').html(errHtml);
                }
            });


        // $.ajax({
        //     url: '../admin/admin_update_check.php',
        //     method: 'POST',
        //     processData: false,
        //     contentType: false,
        //     dataType: 'json',
        //     data: formData,
        //     success: function (data) {
        //         console.log(data);
        //         if (data.status_code == 1) {
        //             let successHtml = `
        //                 <p><u>Статус</u>: ${data.status}</p>
        //                 <p><u>Название статьи</u>: ${data.post_title}</p>
        //                 <p><u>Дата добавления</u>: ${data.upd_time}</p>
        //                 <p>${data.pic_name}</p>
        //                 <p>${data.path}</p>
        //                 <p>${data.short_path}</p>
        //             `;
        //             $('#ajax-status').html(successHtml);
        //
        //             $('.old-title .input-part').html(oldPostTitle);
        //             $('.new-title .input-part').html(newPostTitle);
        //
        //             $('.old-image .input-part img').attr('src', `../../images/${oldPicPath}_rr.jpg`);
        //             $('.new-image .input-part img').attr('src', `../../images/${data.pic_name}_rr.jpg`);
        //
        //             oldImportance = oldImportance === '1' ? 'Важная новость' : 'Не важная новость';
        //             $('.old-importance .input-part').html(oldImportance);
        //             newImportance = newImportance === '1' ? 'Важная новость' : 'Не важная новость';
        //             $('.new-importance .input-part').html(newImportance);
        //
        //             $('.old-text .input-part').html(oldPostText);
        //             $('.new-text .input-part').html(newPostText);
        //
        //             $('form').hide()
        //             $('.hidden-div-ajax').show();
        //         }
        //         else {
        //             let errHtml = `
        //                 <p><u>Статус</u>: ${data.status}</p>
        //                 <p><u>Название статьи</u>: ${data.post_title}</p>
        //                 <p><u>Дата попытки операции</u>: ${data.upd_time}</p>
        //             `;
        //             $('#ajax-status').html(errHtml);
        //         }
        //     }
        // });
    })
})