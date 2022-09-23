const $ = document.querySelector.bind(document)
const $$  = document.querySelectorAll.bind(document)

const islandPopup = $('.island-popup')
const audio = $('#audio')
const wrapper = $('.wrapper')
const title = $('header .title')
const cd = $('.cd img')
const playList = $('.playlist')

// control btn 
const progress = $$('.progress')
const togglePlay = $$('.btn-toggle-play')
const nextBtn = $$('.btn-next')
const prevBtn= $$('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')




const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs : [
        {
            name: 'Hơn cả mây trời',
            singer: 'Như việt',
            path: './assets/musics/HonCaMayTroi.mp3',
            image: './assets/imgs/anh1.jpg'
        },
        {
            name: 'duyen suyen so so',
            singer: 'Jack',
            path: './assets/musics/DuyenDuyenSoSo.mp3',
            image: './assets/imgs/anh2.jpg'
        },
        {
            name: 'Hơn cả mây trời',
            singer: 'Như việt',
            path: './assets/musics/HonCaMayTroi.mp3',
            image: './assets/imgs/anh1.jpg'
        },
        {
            name: 'duyen suyen so so',
            singer: 'Jack',
            path: './assets/musics/DuyenDuyenSoSo.mp3',
            image: './assets/imgs/anh2.jpg'
        },
    ],

    render: function() {
            const htmls = this.songs.map(
                (song,index)=>{
                    return `
                        <div class="song ${index === this.currentIndex ? 'active':''}" data-index = "${index}">
                            <div class="island-thumb">
                                <img src="${song.image}" alt="">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                }
            )
            const islandHeader = this.songs.map((song, index)=>{
                if(index === this.currentIndex){
                     return `
                        <div class="island-thumb">
                        <img src="${song.image}" alt="">
                        </div>
                        <div>
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                    `
                }
            })
            
            $('.island-header').innerHTML = islandHeader.join('')
            $('.playlist').innerHTML = htmls.join('')
    },

    defindProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {
        togglePlay.forEach(element => {
            element.onclick = function() {

                if(app.isPlaying){
                    audio.pause()
                }
                else {
                    audio.play()
                }
            }
        });
        
        audio.onplay = function (){
            app.isPlaying = true
            wrapper.classList.add('playing')
            $('.island-short-title').classList.add('dp-block')
        }
        audio.onpause = function (){
            app.isPlaying = false
            wrapper.classList.remove('playing')
            $('.island-short-title').classList.remove('dp-block')

        }
        audio.ontimeupdate = function (){
            if(audio.duration){
               const progressPer =  Math.floor(audio.currentTime / audio.duration * 100)
               progress.value = progressPer
            }
        }
        progress.forEach(element => {
            element.onchange = function(e){
                const seekTime  = Math.floor(e.target.value / 100 * audio.duration)
                audio.currentTime = seekTime
            }
        })
        
        nextBtn.forEach(element => {
            element.onclick = function() {
                console.log(1);
                if(app.isRandom){
                    app.randomSong()
                }else {
                    app.nextSong()
                }
                audio.play()
            }
        });
        
        prevBtn.forEach(element=>{
            element.onclick = function() {
                if(app.isRandom){
                    app.randomSong()
                }else{
                    app.prevSong()
                }  
                audio.play()
            }
        })
       

        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
            
        }

        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        audio.onended = function (){
            if(app.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.getAttribute('data-index'))
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }
            }else{

            }
        }

        

    },
    nextSong: function() {
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },

    prevSong: function() {
        this.currentIndex --
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1
            }
            this.loadCurrentSong()
            this.render()
            this.scrollToActiveSong()
    },

    randomSong: function(){
        let newIndex
        do{
            newIndex  = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },

    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },200)
    },

    loadCurrentSong: function(){
        title.textContent = this.currentSong.name
        cd.src = this.currentSong.image
        audio.src = this.currentSong.path
    },
    start: function() {
        this.defindProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()

