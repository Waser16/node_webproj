$(document).ready(function() {
    console.log('test works');
    $('input[type=button]').click(function() {
        console.log('button clicked');
        let lastName = $('[name=last-name]').val();
        let firstName = $('[name=first-name]').val();
        let login = $('[name=login]').val();
        let email = $('[name=email]').val();
        let password = $('[name=password]').val();
        let passwordCheck = $('[name=password-check]').val();
        console.log(lastName, firstName, login, email, password, passwordCheck);

        if (!lastName ||!firstName ||!login ||!email ||!password ||!passwordCheck) {
            let errorMessage = '<b>Заполните все поля!</b>';
            $('.ajax-status').html(errorMessage);
            return
        }
        if (password!= passwordCheck) {
            let errorMessage = '<b>Пароли не совпадают!</b>';
            $('.ajax-status').html(errorMessage);
            return
        }

        let data = {
            last_name: lastName,
            first_name: firstName,
            login: login,
            email: email,
            password:  password,
        }
        $.ajax({
            url: '/register',
            type: 'PUT',
            processData: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function(data) {
                if (data.status_code == 200) {
                    console.log(data);
                    let successMessage = `${data.message}`;
                    $('form').remove();
                    $('.ajax-status p').text(successMessage);
                    $('#ajax-success-btn').show();
                }
                else {
                    let errorMessage = `<p>${data.message}</p>`;
                    $('.ajax-status').html(errorMessage);
                }
            }
        })
    })

})