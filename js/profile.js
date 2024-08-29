function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const userProfileContainer = document.getElementById('user-profile');

    fetch(`https://jsonplaceholder.typicode.com/users/${getRandomInt(10)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            preloader.style.display = 'none';
            userProfileContainer.style.display = 'block';

            userProfileContainer.innerHTML = `
                <h2>${data.name}</h2>
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Address:</strong> ${data.address.street}, ${data.address.city}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Website:</strong> <a href="http://${data.website}" target="_blank">${data.website}</a></p>
                <p><strong>Company:</strong> ${data.company.name}</p>
            `;
        })
        .catch(error => {
            preloader.innerHTML = "⚠ Что-то пошло не так. Попробуйте обновить страницу.";
            console.error("There was a problem with the fetch operation:", error);
        });
});
