$(document).ready(function() {

    $('input[type=button]').click(function() {
        let email = $('[name=email]').val();
        let password = $('[name=password]').val();
        console.log(email, password);

        if (!email || !password ) {
            let errorMessage = '<b>Заполните все поля!</b>';
            $('.ajax-status').html(errorMessage);
            return
        }
        else {
            $('.ajax-status').html('');
        }

        let formData = new FormData();
        formData.append('email', email);
        formData.append('password',  password);

        $.ajax({
            url: '/auth/test',
            method: 'POST',
            processData: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({email: email, password:  password}),
            success: function(data) {
                console.log(data);
                if (data.result.length == 1) {
                    $('.ajax-status').html('<b>Вы успешно авторизовались!</b>');
                    window.location.assign('/');
                }
                else {
                    $('.ajax-status').html('<b>Неверный логин или пароль!</b>');
                }
            }
        })
    })
})