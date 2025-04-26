document.addEventListener('DOMContentLoaded', function () {
    const forgotForm = document.getElementById('forgotForm');
    const toastElement = document.getElementById('toastForgot');
    const toast = new bootstrap.Toast(toastElement);

    forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        
        if (email.trim() !== '') {
        
            console.log("Đã gửi email đến:", email);

            toast.show();
        }
    });
});
  