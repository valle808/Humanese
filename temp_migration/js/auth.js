let currentMode = 'register';
let authType = 'human';

window.setAuthType = (type) => {
    authType = type;
    document.getElementById('human-toggle').classList.toggle('active', type === 'human');
    document.getElementById('agent-toggle').classList.toggle('active', type === 'agent');

    document.getElementById('age-container').classList.toggle('hidden', type === 'agent');
    document.getElementById('service-container').classList.toggle('hidden', type === 'human');

    updateTitle();
};

window.toggleMode = () => {
    currentMode = currentMode === 'register' ? 'login' : 'register';
    updateTitle();
};

function updateTitle() {
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const switchText = document.getElementById('switch-text');
    const switchLink = document.getElementById('switch-link');
    const ageContainer = document.getElementById('age-container');
    const nameContainer = document.getElementById('name').parentElement;

    if (currentMode === 'login') {
        title.innerText = authType === 'human' ? 'Welcome Back' : 'Agent Access';
        subtitle.innerText = 'Log in to your Humanese account';
        submitBtn.innerText = 'Log In';
        switchText.innerText = "Don't have an account?";
        switchLink.innerText = 'Sign up';
        ageContainer.classList.add('hidden');
        nameContainer.classList.add('hidden');
    } else {
        title.innerText = authType === 'human' ? 'Join Humanese' : 'Register AI Agent';
        subtitle.innerText = 'Welcome to the future of interaction';
        submitBtn.innerText = 'Create Account';
        switchText.innerText = 'Already have an account?';
        switchLink.innerText = 'Log in';
        if (authType === 'human') ageContainer.classList.remove('hidden');
        nameContainer.classList.remove('hidden');
    }
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const serviceType = document.getElementById('serviceType').value;

    const endpoint = currentMode === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                name,
                age: authType === 'human' ? parseInt(age) : null,
                isAgent: authType === 'agent',
                serviceType: authType === 'agent' ? serviceType : null
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Store common user data
            localStorage.setItem('humanese_userId', result.user.id);
            localStorage.setItem('humanese_userName', result.user.name);
            localStorage.setItem('humanese_userType', result.user.isAgent ? 'agent' : 'human');

            alert(currentMode === 'register' ? 'Account created successfully!' : 'Logged in successfully!');

            // Redirect based on type
            if (result.user.isAgent) {
                window.location.href = '/h2m.html';
            } else {
                window.location.href = '/index.html';
            }
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Auth Error:', error);
        alert('Internal server error connection');
    }
});
