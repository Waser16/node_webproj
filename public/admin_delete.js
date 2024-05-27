$(document).ready(function() {
    console.log('deletion ajax test');

    $('.link-delete').click(function() {
        let parentDiv = $(this).closest('.post');
        let postId = $(this).data('id');
        let postTitle = parentDiv.find('.link-post-title').text().trim();
        console.log(postId, postTitle, parentDiv);

        let formData = new FormData();
        formData.append('post_id', postId);
        formData.append('post_title', postTitle);

        $.ajax({
            url: `/admin/delete/`,
            method: 'DELETE',
            processData: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({post_id: postId, post_title: postTitle}),
            success: function(data) {
                console.log(data);

                if (data.status_code == 1) {
                    let successHtml = `
                        <p><u>Статус</u>: ${data.message}</p>
                        <p><u>Название статьи</u>: ${postTitle}</p>
                        <p><u>Дата удаления</u>: ${data.delete_time}</p>
                    `;
                    $('#ajax-status').html(successHtml);
                    parentDiv.remove();
                }
                else {
                    let errHtml = `
                        <p><u>Статус</u>: ${data.message}</p>
                        <p><u>Название статьи</u>: ${postTitle}</p>
                        <p><u>Дата попытки операции</u>: ${data.delete_time}</p>
                    `;
                    $('#ajax-status').html(errHtml);
                }

            }
        })

    })

})