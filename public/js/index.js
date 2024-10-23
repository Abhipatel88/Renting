gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

let tl = gsap.timeline();

tl.from("nav",{
    y:-500,
    delay:1,
    opacity:0,
    ease: "power3.inOut",
    stagger:1
})
tl.from(".page1 h1,.page1 p ,.page1 .swiper",{
    y:-500,
    delay:0.3,
    opacity:0,
    ease: "power3.in",
    stagger:0.3
})
tl.from(".page2 .top .box",{
    scale:0,
    delay:0.2,
    scrollTrigger:{
        trigger:".page2 .top .box",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 80%",
    }
})
tl.from(".page2 .bottom .l",{
    x:-500,
    delay:0.2,
    opacity:0,
    scrollTrigger:{
        trigger:".page2 .bottom .l",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 80%",
        end:"top 50%"

    }
})
tl.from(".page2 .bottom .r .r-t",{
    y:100,
    delay:0.2,
    duration:0.5,
    opacity:0,
    scrollTrigger:{
        trigger:".page2 .bottom .r .r-t",
        scroller:"#main",
        // markers:true,

        scrub:true,
        start:"top 60%",
        end:"top 50%"
    }
})
tl.from(".page2 .bottom .r .r-b",{
    y:-100,
    delay:0.2,
    opacity:0,
    duration:0.5,

    scrollTrigger:{
        trigger:".page2 .bottom .r .r-t",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 60%",
        end:"top 50%"
    }
})
tl.from(".page4 .l img,.page4 .r",{
    y:100,
    delay:0.2,
    rotate:0,
    opacity:0,
    duration:0.5,

    scrollTrigger:{
        trigger:".page4 .l img",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 60%",
        end:"top 50%"
    }
})
tl.from(".page5 .l .ss,.page5 .l h1,.page5 .l p,.page5 .l button",{
    y:100,
    delay:0.5,
    rotate:0,
    opacity:0,
    duration:0.5,
    satgger:0.5,
    scrollTrigger:{
        trigger:".page5 .l .ss,.page5 .l h1,.page5 .l p,.page5 .l button",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 60%",
        end:"top 50%"
    }
})

tl.from(".page5 .r img",{
    scale:0,
    delay:0.5,
    rotate:0,
    opacity:0,
    duration:0.5,
    satgger:0.5,
    scrollTrigger:{
        trigger:".page5 .l .ss,.page5 .l h1,.page5 .l p,.page5 .l button",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 60%",
        end:"top 50%"
    }
})

tl.from(".page7 .up,.page7 .down",{
    scale:0,
    delay:0.5,
    rotate:0,
    opacity:0,
    duration:0.5,
    satgger:0.5,
    scrollTrigger:{
        trigger:".page7 .up,.page7 .down",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 80%",
        end:"top 50%"
    }
})
tl.from(".page9 .box,.page9 .box img",{
    scale:0,
    delay:0.5,
    rotate:0,
    opacity:0,
    duration:0.5,
    satgger:0.5,
    scrollTrigger:{
        trigger:".page9 .box,.page9 .box img",
        scroller:"#main",
        // markers:true,
        scrub:true,
        start:"top 80%",
        end:"top 50%"
    }
})
