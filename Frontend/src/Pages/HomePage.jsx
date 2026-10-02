
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Footer from "../Components/Footer";
import { useEffect } from "react";

function HomePage(){
    useEffect(() => {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return undefined;

        const context = canvas.getContext("2d");
        const particles = [];
        let animationFrame;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const resetParticle = (particle) => {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.size = Math.random() * 2 + 0.5;
            particle.speedX = (Math.random() - 0.5) * 0.4;
            particle.speedY = (Math.random() - 0.5) * 0.4;
            particle.opacity = Math.random() * 0.4 + 0.1;
            particle.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        for (let index = 0; index < Math.min(60, Math.floor(canvas.width / 20)); index += 1) {
            const particle = {};
            resetParticle(particle);
            particles.push(particle);
        }

        const animateParticles = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.opacity += particle.fadeDirection * 0.003;

                if (particle.opacity <= 0.05 || particle.opacity >= 0.5) {
                    particle.fadeDirection *= -1;
                }
                if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
                    resetParticle(particle);
                }

                context.beginPath();
                context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                context.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`;
                context.fill();
            });

            for (let first = 0; first < particles.length; first += 1) {
                for (let second = first + 1; second < particles.length; second += 1) {
                    const deltaX = particles[first].x - particles[second].x;
                    const deltaY = particles[first].y - particles[second].y;
                    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

                    if (distance < 120) {
                        context.beginPath();
                        context.moveTo(particles[first].x, particles[first].y);
                        context.lineTo(particles[second].x, particles[second].y);
                        context.strokeStyle = `rgba(124, 58, 237, ${(1 - distance / 120) * 0.12})`;
                        context.lineWidth = 0.5;
                        context.stroke();
                    }
                }
            }

            animationFrame = requestAnimationFrame(animateParticles);
        };

        animateParticles();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
    <>
        <Navbar />
        <Hero />
        <Footer />
    </>
    )
}

export default HomePage;