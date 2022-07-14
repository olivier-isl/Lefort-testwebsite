/* By Olivier Issele (aka) Myrage */

const progressBar = document.querySelector('.slider .progressBar')
const from = document.querySelector('.slider .from')
const bar = document.querySelector('.slider .bar')
const to = document.querySelector('.slider .to')


let nextVideo = document.createElement('video')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let videosList = [
		'assets/videos/01.mp4',
		'assets/videos/02.mp4',
		'assets/videos/03.mp4',
	],
	currentPlaying = 0,
	prevCurrentPlaying,
	duration,
	percent = 0,
	margin = 0.5,
	divider = 5,
	isSwitch = false,
	isChanging = false,
	size = {
		width: window.innerWidth,
		height: window.innerHeight
	},
	rect = [],
	newRect = [],
	countLunch = 0,
	video = videosList.map(el => {
		let v = document.createElement('video')
		v.src = el
		v.width = size.width
		v.height = size.height
		v.muted = true
		v.preload = "none"
		return v
	})

canvas.width = size.width
canvas.height = size.height

from.innerHTML = currentPlaying + 1
to.innerHTML = videosList.length



nextVideo.width = size.width
nextVideo.height = size.height
nextVideo.muted = true

for (let i = 0; i < divider; i++) {
	rect[i] = {
		x: ((size.width / divider) * i) + (margin * divider * i),
		y: 0,
		width: size.width / divider - margin,
		height: size.height,
		src: video[0],
		ang: 10,
		scale: 1.4,
		draw() {
			ctx.save()
			ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
			ctx.rotate(Math.PI / 180 * this.ang);
			ctx.scale(this.scale, this.scale)
			ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
			ctx.drawImage(
				this.src,
				this.x,
				this.y,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width * this.scale,
				this.height * this.scale,
			)
			ctx.restore()
		},
		onComplete() {

		}
	}
}

function changeSlideElement() {
	let items = document.querySelectorAll('.slideItem')
	items.forEach((el, i) => {
		if(currentPlaying === i) {
			el.classList.add('active')
		}
		else {
			el.classList.remove('active')
		}
	})
}

function redraw() {
	for (let i = 0; i < divider; i++) {
		newRect[i] = {
			x: ((size.width / divider) * i) + (margin * divider * i),
			y: size.height,
			width: size.width / divider - margin,
			height: 0,
			src: video[currentPlaying],
			ang: 1,
			scale: 1,
			draw() {
				ctx.save()
				ctx.drawImage(
					this.src,
					this.x,
					this.y,
					this.width,
					this.height,
					this.x,
					this.y,
					this.width * this.scale,
					this.height * this.scale
				)
				ctx.restore()
			}
		}
		rect.push(newRect[i])
	}
}

function init() {
	video[0].src = videosList[currentPlaying]
	video[0].playbackRate = 1.0;
	video[0].play()

	intro()
	update()
}

function intro() {
	for (let i = 0; i < divider; i++) {
		let el = rect[i]
		gsap.to(el, {
			duration: 2,
			scale: 1,
			ang: 0
		})
		el.draw()
	}
}

function draw() {
	ctx.clearRect(0, 0, size.width, size.height)
	for (let i = 0; i < rect.length; i++) {
		let el = rect[i]
		el.draw()
	}
}

function progress() {
	percent = 100 + ((video[currentPlaying].currentTime - video[currentPlaying].duration) / video[currentPlaying].duration) * 100
	progressBar.style.setProperty('--progressValue', percent + '%', '')
}

function update() {
	progress()
	//console.log(percent)
	draw()
	switchVideo()
	requestAnimationFrame(update)
}



function switchVideo(dest = "next", click = false) {
	prevCurrentPlaying = currentPlaying
	if (click) {
		isSwitch = true
		if (dest === 'next') {
			currentPlaying++
		} else {
			currentPlaying--
		}
	}
	// ! erreur ici
	if (percent > 98) {
		countLunch++
		if(countLunch === 1) {
			isSwitch = true;
			currentPlaying++
		}

	}
	
	// ! erreur fin
	if (isSwitch === true) {
		isSwitch = false
		if (currentPlaying > videosList.length - 1) {
			currentPlaying = 0
		}
		if(currentPlaying < 0) {
			currentPlaying = videosList.length - 1
		}
		animateSwitch()
		changeSlideElement()
	}
	from.innerHTML = currentPlaying + 1
}

function animateSwitch() {
	isChanging = true
	redraw()
	video[prevCurrentPlaying].pause()
	video[currentPlaying].currentTime = 0
	video[currentPlaying].play()
	for (let i = 0; i < divider; i++) {
		gsap.to(
			rect[i], {
				duration: 1,
				height: 0,
				delay: 0.2 * i
			}
		)
	}
	for (let i = divider; i <= divider * 2 - 1; i++) {
		gsap.to(rect[i], {
			duration: 1,
			src: video[currentPlaying],
			height: size.height,
			y: 0,
			delay: 0.2 * (i - divider),
			onComplete() {
				rect[i].height = size.height
				rect[i].y = 0
				if (i >= divider * 2 - 1) {
					isChanging = false
					countLunch = 0
					rect.splice(0,3)
				}
			}
		})
	}
	
}

document.querySelectorAll('.arrow button').forEach(el => {
	el.addEventListener('click', () => {
		console.log(countLunch)
		let dest = el.getAttribute('id')
		if(isChanging === false) {
			switchVideo(dest, true)
		}
	}, false)
})

init()

/* AUTRES ELEMENTS */


$('section.news .slideNews').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 3,
	dots: false,
	arrows: false,
	responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
	]
})