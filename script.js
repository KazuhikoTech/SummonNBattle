document.addEventListener('DOMContentLoaded', () => {
    const gachaBtn = document.getElementById('gacha-btn');
    const resultSpan = document.getElementById('result');
    const characterImage = document.getElementById('character-image');
    const gachaSound = document.getElementById('gacha-sound');
    
    const battleBtn = document.getElementById('battle-btn');
    const battlePopup = document.getElementById('battle-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const battleResultDetails = document.getElementById('battle-result-details');
    const battleSound = document.getElementById('battle-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document = document.getElementById('lose-sound');
    
    const container = document.querySelector('.container');
    
    const cooldownDuration = 3;
    let isOnCooldown = false;
    let playerStats = {};
    let playerCharacter = {};
    
    const characters = [
        { name: "Aetheria, Sang Penjaga Cahaya", image: "images/db/aetheria.webp" },
        { name: "Kaelus, Pemanah Bayangan", image: "images/db/kaelus.webp" },
        { name: "Lyra, Penyihir Bintang", image: "images/db/lyra.webp" },
        { name: "Ragnar, Pejuang Badai", image: "images/db/ragnar.webp" },
        { name: "Seraphina, Dewi Angin", image: "images/db/seraphina.webp" },
        { name: "Zephyr, Ksatria Langit", image: "images/db/zephyr.webp" },
        { name: "Elias, Sang Alkemis", image: "images/db/elias.webp" },
        { name: "Mael, Naga Bumi", image: "images/db/mael.webp" }
    ];

    function calculateDamage(stats) {
        const apMultiplier = parseFloat(stats.ap) / 100;
        const criticalChance = parseFloat(stats.critical);
        const criticalDamageMultiplier = parseFloat(stats.criticalDamage) / 100;
        
        const isCritical = Math.random() * 100 < criticalChance;

        let totalDamage;
        if (isCritical) {
            totalDamage = apMultiplier * (1 + criticalDamageMultiplier) * 100;
        } else {
            totalDamage = apMultiplier * 100;
        }

        return totalDamage;
    }

    function calculateCombatPoint(stats) {
        const totalHealth = stats.health + stats.defense;
        const totalDamage = calculateDamage(stats);
        const speedBonus = stats.speed / 2;
        return Math.round(totalHealth + totalDamage + speedBonus);
    }
    
    // Fungsi untuk menghitung damage per giliran (digunakan di battle)
    function calculateTurnDamage(attackerStats, defenderStats, log, attackerName, defenderName) {
        // --- PERBAIKAN DI SINI: Rumus dodge diubah agar lebih adil ---
        const dodgeChance = defenderStats.speed / 5; 
        const isDodged = Math.random() * 100 < dodgeChance;

        if (isDodged) {
            log.push(`💨 ${defenderName} berhasil menghindar! Serangan ${attackerName} meleset.`);
            return 0;
        }
        
        const apMultiplier = parseFloat(attackerStats.ap) / 100;
        const criticalChance = parseFloat(attackerStats.critical);
        const criticalDamageMultiplier = parseFloat(attackerStats.criticalDamage) / 100;
        
        const isCritical = Math.random() * 100 < criticalChance;

        let totalDamage;
        if (isCritical) {
            totalDamage = apMultiplier * (1 + criticalDamageMultiplier) * 100;
            log.push(`<span style="color: #ffd700;">⚔️ ${attackerName} menyerang! 💥 Critical Hit!</span>`);
        } else {
            totalDamage = apMultiplier * 100;
            log.push(`⚔️ ${attackerName} menyerang!`);
        }

        log.push(`💔 ${defenderName} menerima ${Math.round(totalDamage)} damage.`);
        return totalDamage;
    }

    gachaBtn.addEventListener('click', () => {
        if (isOnCooldown) {
            return;
        }

        isOnCooldown = true;
        gachaBtn.disabled = true;
        let timeLeft = cooldownDuration;
        gachaBtn.textContent = `Tunggu... (${timeLeft}s)`;

        characterImage.style.display = 'none';
        resultSpan.innerHTML = '---';
        battleBtn.style.display = 'none';

        gachaSound.play();

        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * characters.length);
            resultSpan.innerHTML = `<b>${characters[randomIndex].name}</b>`;
        }, 100);

        const countdownTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                gachaBtn.textContent = `Tunggu... (${timeLeft}s)`;
            } else {
                clearInterval(countdownTimer);
                clearInterval(shuffleInterval);
                
                gachaSound.pause();
                gachaSound.currentTime = 0;

                gachaBtn.textContent = 'Gacha!';
                gachaBtn.disabled = false;
                isOnCooldown = false;

                const randomIndex = Math.floor(Math.random() * characters.length);
                playerCharacter = characters[randomIndex];

                playerStats = {
                    health: getRandomNumber(1, 2000),
                    defense: getRandomNumber(1, 100),
                    ap: getRandomNumber(1, 33.3).toFixed(1),
                    critical: getRandomNumber(1, 33.3).toFixed(1),
                    criticalDamage: getRandomNumber(1, 88).toFixed(1),
                    speed: getRandomNumber(1, 100)
                };

                const playerCombatPoint = calculateCombatPoint(playerStats);

                const output = `
                    <b>${playerCharacter.name}</b><br>
                    <hr>
                    <p class="combat-point-stat">⭐ Total Combat Point: ${playerCombatPoint}</p>
                    <span class="health-stat">❤️ <b>Health:</b> ${playerStats.health}</span><br>
                    <span class="defense-stat">🛡️ <b>Defense:</b> ${playerStats.defense}</span><br>
                    <span class="ap-stat">⚔️ <b>Attack Power:</b> ${playerStats.ap}%</span><br>
                    <span class="critical-stat">💔 <b>Critical:</b> ${playerStats.critical}%</span><br>
                    <span class="critical-damage-stat">⚡ <b>Critical DMG:</b> ${playerStats.criticalDamage}%</span><br>
                    <span class="speed-stat">👟 <b>Speed:</b> ${playerStats.speed}</span>
                `;

                resultSpan.innerHTML = output;
                characterImage.src = playerCharacter.image;
                characterImage.style.display = 'block';
                battleBtn.style.display = 'block';
            }
        }, 1000);
    });
    
    battleBtn.addEventListener('click', () => {
        battleBtn.disabled = true;
        battleBtn.textContent = 'Sedang Bertarung...';
        
        battleSound.play();
        container.classList.add('shaking');

        let randomOpponentIndex;
        do {
            randomOpponentIndex = Math.floor(Math.random() * characters.length);
        } while (characters[randomOpponentIndex].name === playerCharacter.name);
        const opponent = characters[randomOpponentIndex];
        
        const opponentStats = {
            health: getRandomNumber(1, 2000),
            defense: getRandomNumber(1, 100),
            ap: getRandomNumber(1, 33.3).toFixed(1),
            critical: getRandomNumber(1, 33.3).toFixed(1),
            criticalDamage: getRandomNumber(1, 88).toFixed(1),
            speed: getRandomNumber(1, 100)
        };
        
        let playerCurrentHealth = playerStats.health + playerStats.defense;
        let opponentCurrentHealth = opponentStats.health + opponentStats.defense;
        let log = [];
        let winner = null;

        let attackerName = playerCharacter.name;
        let defenderName = opponent.name;
        let attackerStats = playerStats;
        let defenderStats = opponentStats;
        let attackerCurrentHealth = playerCurrentHealth;
        let defenderCurrentHealth = opponentCurrentHealth;

        if (opponentStats.speed > playerStats.speed) {
            log.push(`👟 ${opponent.name} lebih cepat! Dia menyerang duluan.`);
            attackerName = opponent.name;
            defenderName = "Anda";
            attackerStats = opponentStats;
            defenderStats = playerStats;
            attackerCurrentHealth = opponentCurrentHealth;
            defenderCurrentHealth = playerCurrentHealth;
        } else {
            log.push(`👟 Anda lebih cepat! Anda menyerang duluan.`);
        }

        let turn = 1;
        while (playerCurrentHealth > 0 && opponentCurrentHealth > 0 && turn < 50) {
            log.push(`<br><b>--- Giliran ${turn} ---</b>`);

            const damage1 = calculateTurnDamage(attackerStats, defenderStats, log, attackerName, defenderName);
            defenderCurrentHealth -= damage1;
            log.push(`💔 Health ${defenderName} tersisa ${Math.round(Math.max(0, defenderCurrentHealth))}.`);
            if (defenderCurrentHealth <= 0) {
                winner = (attackerName === playerCharacter.name ? "player" : "opponent");
                break;
            }

            const damage2 = calculateTurnDamage(defenderStats, attackerStats, log, defenderName, attackerName);
            attackerCurrentHealth -= damage2;
            log.push(`💔 Health ${attackerName} tersisa ${Math.round(Math.max(0, attackerCurrentHealth))}.`);
            if (attackerCurrentHealth <= 0) {
                winner = (defenderName === playerCharacter.name ? "player" : "opponent");
                break;
            }
            
            playerCurrentHealth = (attackerName === playerCharacter.name ? attackerCurrentHealth : defenderCurrentHealth);
            opponentCurrentHealth = (attackerName === playerCharacter.name ? defenderCurrentHealth : attackerCurrentHealth);

            turn++;
        }
        
        let resultMessage = '';
        let resultTitle = '';
        let resultSoundToPlay;

        if (winner === "player") {
            resultTitle = 'Anda Menang!';
            resultMessage = 'Selamat, Anda berhasil mengalahkan lawan!';
            resultSoundToPlay = winSound;
        } else {
            resultTitle = 'Anda Kalah!';
            resultMessage = 'Anda dikalahkan oleh lawan. Coba lagi!';
            resultSoundToPlay = loseSound;
        }

        setTimeout(() => {
            container.classList.remove('shaking');
            battleBtn.textContent = 'Mulai Pertarungan!';
            
            battleSound.pause();
            battleSound.currentTime = 0;
            resultSoundToPlay.play();
            
            battlePopup.style.display = 'flex';
            document.getElementById('popup-title').textContent = resultTitle;
            
            battleResultDetails.innerHTML = `
                <div id="battle-log">${log.join('<br>')}</div>
                <div class="character-card">
                    <img src="${opponent.image}" alt="${opponent.name}" class="character-image-menu">
                    <div class="character-info">
                        <h3>${opponent.name}</h3>
                        <p class="combat-point-stat">⭐ Total Combat Point: ${calculateCombatPoint(opponentStats)}</p>
                        <p><b>Statistik Lawan:</b></p>
                        <p class="health-stat">❤️ Health: ${opponentStats.health}</p>
                        <p class="defense-stat">🛡️ Defense: ${opponentStats.defense}</p>
                        <p class="ap-stat">⚔️ Attack Power: ${opponentStats.ap}%</p>
                        <p class="critical-stat">💔 Critical: ${opponentStats.critical}%</p>
                        <p class="critical-damage-stat">⚡ <b>Critical DMG:</b> ${opponentStats.criticalDamage}%</p>
                        <p class="speed-stat">👟 <b>Speed:</b> ${opponentStats.speed}</p>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 15px;"><b>${resultMessage}</b></p>
            `;
            battleBtn.disabled = false;
        }, 2000);
    });

    closePopupBtn.addEventListener('click', () => {
        battlePopup.style.display = 'none';
        winSound.pause();
        loseSound.pause();
        winSound.currentTime = 0;
        loseSound.currentTime = 0;
    });

    function getRandomNumber(min, max) {
        if (Number.isInteger(min) && Number.isInteger(max)) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            return Math.random() * (max - min) + min;
        }
    }
});