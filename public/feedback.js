$(document).ready(function() {
    console.log('feedback.js connected');
    $('input[type=button]').click(function() {
        console.log('Listener button clicked');

        let name = $('[name=name]').val();
        let phone = $('[name=phone]').val();
        let email = $('[name=email]').val();
        let content = $('textarea').val();

        if (!name || !email || !phone || !content) {
            let errorMessage = '<b>Заполните все поля!</b>';
            $('.ajax-status').html(errorMessage);
            return;
        }

        let data = {
            name: name,
            email: email,
            phone_number: phone,
            content: content
        }
        console.log(data);

        fetch('/feedback', {
            'method': 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status_code) {
                    let successMessage = '<b>' + data.message + '</b>';
                    $('.ajax-status').html(successMessage);
                    $('.registration-form').remove();
                    $("<style> .main-container {padding-bottom: 600px}</style>").appendTo('head');
                    // $("<style> .footer-container {margin-top: 600px}</style>").appendTo('head');
                }
                else {
                    let errorMessage = '<b>' + data.message + '</b>';
                    $('.ajax-status').html(errorMessage);
                }
            })
    })
})