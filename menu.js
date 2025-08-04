document.addEventListener('DOMContentLoaded', () => {
    const characterDetails = document.getElementById('character-details');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentCharIndexSpan = document.getElementById('current-char-index');
    
    let currentCharacterIndex = 0;
    
    const classDescriptions = [
        {
            nama: "Aetheria",
            class: "Penjaga Cahaya",
            senjata: "Cahaya Suci",
            story: "Aetheria adalah penjaga kuno yang diberkati oleh para dewa cahaya. Ia menggunakan kekuatan suci untuk menyembuhkan sekutu dan mengusir kegelapan.",
            image: "images/db/aetheria.jpeg"
        },
        {
            nama: "Kaelus",
            class: "Pemanah Bayangan",
            senjata: "Busur dan Panah",
            story: "Seorang pemburu bayangan yang bergerak di kegelapan. Panahnya tidak pernah meleset, dan ia hanya berburu target yang ditakdirkan.",
            image: "images/db/kaelus.jpeg"
        },
        {
            nama: "Lyra",
            class: "Penyihir Bintang",
            senjata: "Tongkat Sihir",
            story: "Lyra mempelajari sihir dari bintang-bintang. Mantra-mantranya seindah gugusan rasi bintang, tetapi juga memiliki kekuatan yang menghancurkan.",
            image: "images/db/lyra.jpeg"
        },
        {
            nama: "Ragnar",
            class: "Pejuang Badai",
            senjata: "Kapak Ganda",
            story: "Berdiri teguh di tengah badai, Ragnar adalah pejuang yang menguasai elemen angin dan petir. Setiap ayunan kapaknya membawa kekuatan badai.",
            image: "images/db/ragnar.jpeg"
        },
        {
            nama: "Seraphina",
            class: "Dewi Angin",
            senjata: "Pedang Angin",
            story: "Seraphina adalah keturunan dewa angin. Ia bergerak secepat hembusan angin, dan pedangnya mampu membelah awan dengan satu tebasan.",
            image: "images/db/seraphina.jpeg"
        },
        {
            nama: "Zephyr",
            class: "Ksatria Langit",
            senjata: "Perisai dan Tombak",
            story: "Zephyr adalah ksatria yang ditugaskan untuk menjaga langit. Dengan perisainya, ia melindungi yang lemah, dan tombaknya menjatuhkan setiap ancaman dari langit.",
            image: "images/db/zephyr.jpeg"
        },
        {
            nama: "Elias",
            class: "Sang Alkemis",
            senjata: "Ramuan",
            story: "Elias adalah seorang ilmuwan yang mencari rahasia alam. Dengan ramuan buatannya, ia bisa menciptakan keajaiban atau kehancuran.",
            image: "images/db/elias.jpeg"
        },
        {
            nama: "Mael",
            class: "Naga Bumi",
            senjata: "Tangan Kosong",
            story: "Mael adalah inkarnasi dari kekuatan bumi. Ia tidak butuh senjata, karena pukulan dan tendangannya memiliki kekuatan gempa bumi.",
            image: "images/db/mael.jpeg"
        }
    ];

    function updateCharacterDetails() {
        const char = classDescriptions[currentCharacterIndex];
        characterDetails.innerHTML = `
            <div class="character-card">
                <img src="${char.image}" alt="${char.nama}" class="character-image-menu">
                <div class="character-info">
                    <h3>${char.nama}</h3>
                    <p><b>Class:</b> ${char.class}</p>
                    <p><b>Senjata:</b> ${char.senjata}</p>
                    <p><b>Background Story:</b> ${char.story}</p>
                </div>
            </div>
        `;
        currentCharIndexSpan.textContent = `${currentCharacterIndex + 1} / ${classDescriptions.length}`;
    }

    updateCharacterDetails();

    prevBtn.addEventListener('click', () => {
        currentCharacterIndex--;
        if (currentCharacterIndex < 0) {
            currentCharacterIndex = classDescriptions.length - 1;
        }
        updateCharacterDetails();
    });

    nextBtn.addEventListener('click', () => {
        currentCharacterIndex++;
        if (currentCharacterIndex >= classDescriptions.length) {
            currentCharacterIndex = 0;
        }
        updateCharacterDetails();
    });
});