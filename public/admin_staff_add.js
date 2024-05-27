$(document).ready(function() {
    console.log('js connected');

    $('input[type=button]').click(function() {
        let lastName = $('[name=last-name]').val();
        let firstName = $('[name=first-name]').val();
        let login = $('[name=login]').val();
        let password = $('[name=password]').val();
        let email = $('[name=email]').val();
        let position = $('[name=position]').val();

        if (!lastName ||!firstName ||!login ||!password ||!email ||!position) {
            let errorMessage = '<b>Заполните все поля!</b>';
            $('#ajax-status').html(errorMessage);
            return;
        }
        console.log(lastName, firstName, login, password, email, position);

        // let data = new FormData();
        // data.append('last_name', lastName);
        // data.append('first_name', firstName);
        // data.append('login', login);
        // data.append('password',  password);
        // data.append('email', email);
        // data.append('position', position);
        let data = {
            last_name: lastName,
            first_name: firstName,
            login: login,
            password:  password,
            email: email,
            position: position,
        }

        fetch('/admin/staff/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status_code) {
                    window.location.assign('/admin/staff')
                }
                else {
                    $('#ajax-status').html(data.message);
                }
            })
    })

})