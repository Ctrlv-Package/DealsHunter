// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Offset for fixed navbar
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Countdown timer for deals
function updateTimers() {
    document.querySelectorAll('.time-left').forEach(timer => {
        const timeText = timer.textContent;
        const [hours, minutes] = timeText.match(/\d+/g).map(Number);
        
        let totalMinutes = hours * 60 + minutes;
        if (totalMinutes > 0) {
            totalMinutes--;
            const newHours = Math.floor(totalMinutes / 60);
            const newMinutes = totalMinutes % 60;
            timer.textContent = `Ends in: ${newHours}h ${newMinutes}m`;
        } else {
            timer.textContent = 'Deal Ended';
            timer.closest('.deal-card').style.opacity = '0.5';
        }
    });
}

// Update timers every minute
setInterval(updateTimers, 60000);

// Deal buttons functionality
document.querySelectorAll('.deal-button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.deal-card');
        const productName = card.querySelector('h3').textContent;
        const price = card.querySelector('.deal-price').textContent;
        
        alert(`Great choice! You're about to get the ${productName} for ${price}`);
        // Here you would typically handle the purchase process
    });
});

// Newsletter subscription
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would typically send this to your backend
        console.log('Subscription email:', email);
        
        alert('Thanks for subscribing! You\'ll receive our best deals daily.');
        this.reset();
    });
}

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            message: contactForm.querySelector('#message').value
        };

        // Here you would typically send the form data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Clear form
        contactForm.reset();
    });
}

// Add animation to project cards when they come into view
const observeElements = (elements, className) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(className);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Observe project cards
const projectCards = document.querySelectorAll('.project-card');
observeElements(projectCards, 'fade-in');

// Typing effect for hero section
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing effect when the page loads
    window.addEventListener('load', typeWriter);
}

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize countdown timers on page load
updateTimers();
