//Button Element
const deleteDataUserGames = document.querySelectorAll('.deleteDataUserGames');
const deleteDataUserBiodata = document.querySelectorAll('.deleteBiodataUser');
const deleteHistoryUser = document.querySelectorAll('.deleteHistoryUser');

//Add Event Element
deleteDataUserGames.forEach((ddu) => {
    ddu.addEventListener('click', () => {
        const id = ddu.dataset.id;
        const form = document.querySelector('.modal-content form');
    
        form.setAttribute('action', '/dashboard/data-users/delete/' + id + '?_method=DELETE');
    });
});

deleteDataUserBiodata.forEach((ddu) => {
    ddu.addEventListener('click', () => {
        const id = ddu.dataset.id;
        const form = document.querySelector('.modal-content form');
    
        form.setAttribute('action', '/dashboard/biodata-users/delete/' + id + '?_method=DELETE');
    });
});

deleteHistoryUser.forEach((ddu) => {
    ddu.addEventListener('click', () => {
        const id = ddu.dataset.id;
        const form = document.querySelector('.modal-content form');
    
        form.setAttribute('action', '/dashboard/history-users/delete/' + id + '?_method=DELETE');
    });
});