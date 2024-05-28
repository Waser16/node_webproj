$(document).ready(function() {
    console.log('index filter connected');

    $('#posts-yesterday').click(function() {
        console.log('posts-yesterday clicked');
        let filterDate = generateFilterDate(1);

        $('.post').each(function() {
            let postDate = $(this).find('.post_date').text();
            postDate = new Date(postDate);
            filterDate = new Date(filterDate);

            if (postDate <= filterDate) {
                $(this).css('display', 'none');
            }
            else {
                $(this).show();
            }
        })

        $('#posts-header').text('Новости за последний день');
    })

    $('#posts-last-week').click(function() {
        console.log('posts-last-week clicked');
        let filterDate = generateFilterDate(7);
        $('.post').each(function() {
            let postDate = $(this).find('.post_date').text();
            postDate = new Date(postDate);
            filterDate = new Date(filterDate);

            if (postDate <= filterDate) {
                $(this).css('display', 'none');
            }
            else {
                $(this).show()
            }
        })
        $('#posts-header').text('Новости за последнюю неделю');
    })

    $('#posts-last-month').click(function() {
        console.log('posts-last-month clicked');

        let filterDate = generateFilterDate(31);
        $('.post').each(function() {
            let postDate = $(this).find('.post_date').text();
            postDate = new Date(postDate);
            filterDate = new Date(filterDate);

            if (postDate <= filterDate) {
                $(this).css('display', 'none');
            }
            else {
                $(this).show()
            }
        })
        $('#posts-header').text('Новости за последний месяц');
    })

    $('#posts-all-time').click(function() {
        console.log('posts-last-month clicked');
        $('.post').each(function() {

            $(this).show()
        })
        $('#posts-header').text('Новости за все время');
    })

    function generateFilterDate(offset) {
        let date = new Date();
        date.setDate(date.getDate() - offset);
        let filterDate = date.getFullYear()
            + '-' + ('0' + (1 + date.getMonth())).slice(-2)
            + '-' + ('0' + date.getDate()).slice(-2);

        return filterDate;
    }

    $('.hide-about').click(function() {
        console.log('hide-about clicked');
        let parentDiv = $(this).parent().parent();
        let p = parentDiv.find('#about-info');
        let span = parentDiv.find('.hide-about');
        console.log(parentDiv);
        if (p.data('state') == '0') {
            p.data('state', '1');
            p.show();
            span.text('Скрыть');
        }
        else {
            p.data('state', '0');
            p.hide();
            span.text('Раскрыть');
        }
    })

})