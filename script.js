// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.contact-section, .skills-section, .about-section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Add click effects to contact cards
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add hover effect to skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing effect to the title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.querySelector('.title');
    const originalText = titleElement.textContent;
    
    setTimeout(() => {
        typeWriter(titleElement, originalText, 80);
    }, 1000);
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add phone number formatting
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,4})(\d{3})(\d{3})(\d{3})$/);
    
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    
    return phoneNumber;
}

// Initialize phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneElement = document.querySelector('.contact-card.phone .contact-info p');
    if (phoneElement) {
        const formattedPhone = formatPhoneNumber(phoneElement.textContent);
        phoneElement.textContent = formattedPhone;
    }
});

// Add a simple visitor counter (using localStorage)
function updateVisitorCounter() {
    let visits = localStorage.getItem('visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visits', visits);
    
    // You can display this somewhere if needed
    console.log(`Visits: ${visits}`);
}

document.addEventListener('DOMContentLoaded', updateVisitorCounter);

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .contact-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
