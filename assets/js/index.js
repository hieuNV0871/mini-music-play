const $ = document.querySelector.bind(document)
const $$  = document.querySelectorAll.bind(document)

const islandPopup = $('.island-popup')
const audio = $('#audio')
const player = $('.player')
const dashboardTitle = $('.dashboard-title')
const dashboardImage = $('.dashboard-image')
const playList = $('.playlist')

// control btn 
const progress = $$('.progress')
const togglePlays = $$('.toggle-play-btn')
const nextBtns = $$('.next-btn')
const prevBtns= $$('.prev-btn')
const randomBtn = $('.random-btn')
const repeatBtn = $('.repeat-btn')




const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs : [
        {
            name: 'Ai đợi mình được mãi',
            singer: 'Thanh Hưng',
            path: './assets/musics/AiDoiMinhDuocMai.mp3',
            image: './assets/imgs/anh1.jpg'
        },
        {
            name: 'Ấn nút nhớ thả giấc mơ',
            singer: 'Sơn Tùng MT-P',
            path: './assets/musics/AnNutNhoThaGiacMo.mp3',
            image: './assets/imgs/anh2.jpg'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'Hiếu',
            path: './assets/musics/ChuyenDoiTa.mp3',
            image: './assets/imgs/anh3.jpg'
        },
        {
            name: 'Forget me now',
            singer: 'Hiếu',
            path: './assets/musics/ForgetMeNow.mp3',
            image: './assets/imgs/anh4.jpg'
        },
        {
            name: 'Hoa Điêu Thuyền',
            singer: 'Hiếu',
            path: './assets/musics/HoaDieuThuyen.mp3',
            image: './assets/imgs/anh5.jpg'
        },
        {
            name: 'Hơn cả mây trời',
            singer: 'Như Việt',
            path: './assets/musics/HonCaMayTroi.mp3',
            image: './assets/imgs/anh6.jpg'
        },
        {
            name: 'Lạ Lùng',
            singer: 'Vũ',
            path: './assets/musics/LaLung.mp3',
            image: './assets/imgs/anh7.jpg'
        },
        {
            name: 'Sao mình chưa nắm tay',
            singer: 'Hiếu',
            path: './assets/musics/SaoMinhChuaNamTayNhau.mp3',
            image: './assets/imgs/anh8.jpg'
        },
        {
            name: 'Thế giới mất đi Một người',
            singer: 'Tăng phúc',
            path: './assets/musics/TheGioiMatDiMotNguoi.mp3',
            image: './assets/imgs/anh9.jpg'
        },
        {
            name: 'Vấn Vương',
            singer: 'Hiếu',
            path: './assets/musics/VanVuong.mp3',
            image: './assets/imgs/anh10.jpg'
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
                                <h3 class="title" title="${song.name}">${song.name}</h3>
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
        togglePlays.forEach(togglePlay => {
            togglePlay.onclick = function() {

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
            player.classList.add('playing')
            $('.island-title').classList.add('dp-block')
        }
        audio.onpause = function (){
            app.isPlaying = false
            player.classList.remove('playing')
            $('.island-title').classList.remove('dp-block')

        }
        audio.ontimeupdate = function (){
            if(audio.duration){
               const progressPer =  Math.floor(audio.currentTime / audio.duration * 100)
               progress.forEach(progress=>{
                progress.value = progressPer
               })
            }
        }
        progress.forEach(progress => {
            progress.onchange = function(e){
                const seekTime  = Math.floor(e.target.value / 100 * audio.duration)
                audio.currentTime = seekTime
            }
        })
        
        nextBtns.forEach(nextBtn => {
            nextBtn.onclick = function() {
                if(app.isRandom){
                    app.randomSong()
                }else {
                    app.nextSong()
                }
                audio.play()
            }
        });
        
        prevBtns.forEach(prevBtn=>{
            prevBtn.onclick = function() {
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
                $('.dashboard-next-btn').click()
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
        dashboardTitle.textContent = this.currentSong.name
        dashboardImage.src = this.currentSong.image
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

