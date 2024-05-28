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
    })

    $('#posts-all-time').click(function() {
        console.log('posts-last-month clicked');
        let posts = $(document).find('.post');

        $('.post').each(function() {

            $(this).show()
        })
    })

    function generateFilterDate(offset) {
        let date = new Date();
        date.setDate(date.getDate() - offset);
        let filterDate = date.getFullYear()
            + '-' + ('0' + (1 + date.getMonth())).slice(-2)
            + '-' + ('0' + date.getDate()).slice(-2);

        return filterDate;
    }
})