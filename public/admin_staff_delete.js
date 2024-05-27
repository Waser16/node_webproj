$(document).ready(function() {
    console.log('admin_staff_delete connected');
    $('.link-delete').click(function() {
        console.log('link-delete clicked');
        let parentDiv = $(this).closest('.staff')
        let staffId = $(this).attr('data-id');
        console.log(staffId, parentDiv);

        let data = new FormData();
        data.append('staff_id', staffId);

        fetch(`/admin/staff/delete/${staffId}`, {
            method: 'DELETE',
            body: data
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status_code == 1) {
                    parentDiv.remove();
                    $('#ajax-status').html('<b>Сотрудник успешно удален!</b>');
                }
                else {
                    $('#ajax-status').html('<b>Ошибка при удалении сотрудника!</b>');
                }
            })
    })
})