const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.form-section');
        const progress = document.querySelector('.progress');

        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                sections.forEach(section => section.classList.remove('active'));
                sections[index].classList.add('active');

                progress.style.width = `${(index + 1) * 33.33}%`;
            });
        });

        const fileUpload = document.getElementById('resumeUpload');
        const fileInput = fileUpload.querySelector('input[type="file"]');

        fileUpload.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('dragover', e => {
            e.preventDefault();
            fileUpload.style.borderColor = 'var(--primary)';
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.style.borderColor = '#e2e8f0';
        });

        fileUpload.addEventListener('drop', e => {
            e.preventDefault();
            fileInput.files = e.dataTransfer.files;
            updateFileUpload(e.dataTransfer.files[0].name);
            fileUpload.style.borderColor = '#e2e8f0';
        });

        fileInput.addEventListener('change', e => {
            if (e.target.files.length) {
                updateFileUpload(e.target.files[0].name);
            }
        });

        function updateFileUpload(fileName) {
            const text = fileUpload.querySelector('p');
            text.textContent = `Selected file: ${fileName}`;
            fileUpload.style.borderColor = 'var(--secondary)';
            fileUpload.style.background = 'rgba(16, 185, 129, 0.1)';
        }

        const form = document.getElementById('applicationForm');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;

        function validateForm() {
            let isValid = true;
            const inputs = form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value) {
                    showError(input, 'This field is required');
                    isValid = false;
                } else if (input.type === 'email' && input.value && !emailRegex.test(input.value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                } else if (input.name === 'phone' && input.value && !phoneRegex.test(input.value)) {
                    showError(input, 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    removeError(input);
                }
            });

            return isValid;
        }

        function showError(input, message) {
            const group = input.closest('.input-group');
            let error = group.querySelector('.error-message');
            
            if (!error) {
                error = document.createElement('div');
                error.className = 'error-message';
                group.appendChild(error);
            }

            error.textContent = message;
            input.classList.add('error');
            group.classList.add('error-shake');
            
            setTimeout(() => {
                group.classList.remove('error-shake');
            }, 500);
        }

        function removeError(input) {
            const group = input.closest('.input-group');
            const error = group.querySelector('.error-message');
            if (error) {
                error.remove();
            }
            input.classList.remove('error');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            const formData = new FormData(form);
            const jsonData = {};
            
            formData.forEach((value, key) => {
                if (key === 'resume' && value.name) {
                    jsonData[key] = value.name;
                } else {
                    jsonData[key] = value;
                }
            });

            try {

                await new Promise(resolve => setTimeout(resolve, 1500));

                const jsonString = JSON.stringify(jsonData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `application-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showModal();

                form.reset();
                resetFileUpload();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your application. Please try again.');
            }
        });

        function resetFileUpload() {
            const text = fileUpload.querySelector('p');
            text.textContent = 'Drag & drop your file here or click to browse';
            fileUpload.style.borderColor = '#e2e8f0';
            fileUpload.style.background = 'transparent';
        }

        function showModal() {
            document.getElementById('modalOverlay').classList.add('active');
            document.getElementById('successModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('active');
            document.getElementById('successModal').classList.remove('active');
        }

        document.getElementById('modalOverlay').addEventListener('click', closeModal);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && document.getElementById('successModal').classList.contains('active')) {
                closeModal();
            }
        });

        const interactiveElements = document.querySelectorAll('button, .nav-item, .file-upload');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseover', () => {
                element.style.transform = 'translateY(-2px)';
            });
            element.addEventListener('mouseout', () => {
                element.style.transform = 'translateY(0)';
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            const formContainer = document.querySelector('.form-container');
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(20px)';

            setTimeout(() => {
                formContainer.style.transition = 'all 0.5s ease';
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0)';
            }, 100);
        });