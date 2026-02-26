const headerPath: string = 'assets/json-animations/header.json';
const floatingPhone: string = 'assets/json-animations/floating-phone.json';
const stayMotivated: string = 'assets/json-animations/stay-motivated.json';
const personalisedLearning: string = 'assets/json-animations/personalised-learning.json';
const backedByScience: string = 'assets/json-animations/backed-by-science.json';
const freeFunEffective: string = 'assets/json-animations/free-fun-effective.json';

interface AnimationLoaderOptions {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    path: string;
}

const animationLoader = (id: string, path: string, autoplays: boolean = false): void => {
    const container = document.getElementById(id) as HTMLElement;
    if (!container) return;

    // Use the new user-uploaded mascot image
    const imgPath = './assets/images/mascot.jpg';

    const img = document.createElement("img");
    img.src = imgPath;
    img.alt = "Humanese Mascot";
    img.style.width = "100%";
    img.style.maxWidth = "300px";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "0 auto";
    // Add a fun floating animation to mimic the living mascot
    img.style.animation = "mascot-float 4s ease-in-out infinite";

    // Add keyframes if not already present
    if (!document.getElementById("mascot-float-styles")) {
        const style = document.createElement('style');
        style.id = "mascot-float-styles";
        style.innerHTML = `
            @keyframes mascot-float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(2deg); }
            }
        `;
        document.head.appendChild(style);
    }

    container.appendChild(img);
};

// Load all animations in the index page
animationLoader("left-logging-header", headerPath, true);
animationLoader("phone-animation", floatingPhone, true);
animationLoader("humanense-feature-animation-stay-motivated", stayMotivated, true);
animationLoader("humanense-feature-animation-personalised-learning", personalisedLearning, true);
animationLoader("humanense-feature-animation-backed-by-science", backedByScience, true);
animationLoader("humanense-feature-animation-free-fun-effective", freeFunEffective, true);
