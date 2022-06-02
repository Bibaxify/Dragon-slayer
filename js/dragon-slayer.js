"use strict"; // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/

// L'unique variable globale est un objet contenant l'état du jeu.
const game = {
    level: 0,
    pvPlayer: 0,
    pvDragon: 0,
    joueur: 0,
    dragon: 0,
    damage: 0,
    attacker: 0,
    round: 1,
    attackerImg: null,
    attackerTxt: null,
};

// Déclaration des constantes du jeu, rend le code plus compréhensible

/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/

/**
 * Détermine qui du joueur ou du dragon prend l'initiative et attaque
 * @returns {string} - DRAGON|PLAYER
 */

function getAttacker() {
    game.joueur = throwDices(10, 6);
    game.dragon = throwDices(10, 6);
    if (game.joueur < game.dragon) {
        return "dragon";
    } else {
        return "joueur";
    }
}

/**
 * Calcule les points de dommages causés par le dragon au chevalier
 * @returns {number} - le nombre de points de dommages
 */
function computeDamagePoint(attacker) {
    // On tire 3D6 pour le calcul des points de dommages causés par le dragon
    let damagePoint = throwDices(3, 6);

    /*
      Majoration ou minoration des points de dommage en fonction du niveau de difficulté
      Pas de pondération si niveau normal
    */

    /*
             Au niveau Facile,
             Si le dragon attaque, on diminue les points de dommage de 2D6 %
             Si le joueur attaque, on augmente les points de dommage de 2D6 %
            */

    if (game.level === 1) {
        if (attacker === "dragon") {
            return Math.round(
                damagePoint - damagePoint * (throwDices(2, 6) / 100)
            );
        } else {
            return Math.round(
                damagePoint + damagePoint * (throwDices(2, 6) / 100)
            );
        }
    } else if (game.level === 2) {
        return damagePoint;
    } else if (game.level === 3) {
        if (attacker === "dragon") {
            return Math.round(
                damagePoint + damagePoint * (throwDices(1, 6) / 100)
            );
        } else {
            return Math.round(
                damagePoint - damagePoint * (throwDices(1, 6) / 100)
            );
        }
    }

    /*
             Au niveau difficile,
             Si le dragon attaque, on augmente les points de dommage de 1D6 %
             Si le joueur attaque, on diminue les points de dommage de 1D6 %
            */

    // On retourne les points de dommage
}

/**
 * Boucle du jeu : répète l'exécution d'un tour de jeu tant que les 2 personnages sont vivants
 */
function gameLoop() {
    // Le jeu s'exécute tant que le dragon et le joueur sont vivants.

    // Qui va attaquer lors de ce tour de jeu ?
    do {
        game.attacker = getAttacker();
    

        // Combien de dommages infligent l'assaillant = PV que va perdre le personnage attaqué
        game.damage = computeDamagePoint(game.attacker);

        // Est-ce que le dragon est plus rapide que le joueur ?
        // Diminution des points de vie du joueur.
        // attacker == PLAYER  
        // Diminution des points de vie du dragon.

        if (game.attacker === "dragon") {
            game.pvPlayer -= game.damage;
        } else {
            game.pvDragon -= game.damage;
        }
        console.log("debug", game.pvDragon, game.pvPlayer);


        // Affichage du journal : que s'est-il passé ?
        showGameLog(game.attacker, game.damage);

        document.write (`
        <h3>Tour n° ${game.round}</h3>
        <figure class="game-round">
        <img src="${game.attackerImg}" alt="${game.attacker} vainqueur">
        <figcaption>${game.attackerTxt} ${game.damage} points de dommage !</figcaption>
        </figure>
        `)

        // Affichage de l'état du jeu ok
        showGameState();

        // On passe au tour suivant.
        game.round++;
    } while (game.pvPlayer > 0 && game.pvDragon > 0);
}



/**
 * Initialise les paramètres du jeu
 *  Création d'un objet permettant de stocker les données du jeu
 *      ->  les données seront stockées dans une propriété de l'objet,
 *          on évite ainsi de manipuler des variables globales à l'intérieur des fonctions qui font évoluer les valeurs
 *
 * Quelles sont les données necessaires tout au long du jeu (pour chaque round)
 *    -  N° du round (affichage)
 *    -  Niveau de difficulté (calcul des dommages)
 *    -  Points de vie du joueur ( affichage + fin de jeu )
 *    -  Points de vie du dragon ( affichage + fin de jeu )
 */
function initializeGame() {
    // Initialisation de la variable globale du jeu. un objet
    /*
     * 10 tirages, la pondération se joue sur le nombre de faces
     *    -> plus il y a de faces, plus le nombre tiré peut-être élévé
     */

    // Choix du niveau du jeu
    game.level = requestInteger(
        "Niveau de difficulté \n 1. Facile \n 2. Moyen \n 3. Difficile",
        1,
        3
    );

    //    * Détermination des points de vie de départ selon le niveau de difficulté.

    if (game.level === 1) {
        game.pvPlayer = throwDices(10, 10) + 100;
        game.pvDragon = throwDices(5, 10) + 100;
    } else if (game.level === 2) {
        game.pvPlayer = throwDices(10, 10) + 100;
        game.pvDragon = throwDices(10, 10) + 100;
    } else {
        game.pvPlayer = throwDices(7, 10) + 100;
        game.pvDragon = throwDices(10, 10) + 100;
    }
   
    document.write(`
    <div class="game">
    <h2>Que la fête commence !!</h2>

    <div class="game-state">
        <figure class="game-state_player">
            <img src="images/knight.png" alt="Chevalier"/>
            <figcaption>${game.pvPlayer} PV</figcaption>
        </figure>
        <figure class="game-state_player">
            <img src="images/dragon.png" alt="Dragon">
            <figcaption>${game.pvDragon} PV</figcaption>
        </figure>
    </div>`);
}

/**
 * Affichage de l'état du jeu, c'est-à-dire des points de vie respectifs des deux combattants
 */
function showGameState() {
    document.write(`
    <div class="game-state">
    <figure class="game-state_player">
    <img src="images/knight.png" alt="Chevalier">`)
    
    
    // Au départ du jeu, les joueurs sont encore en bonne état !
    
    // Affichage du code HTML
    
    // Affichage de l'état du joueur
    
    // Si le joueur est toujours vivant, on affiche ses points de vie
    if (game.pvPlayer > 0) {
        console.log("pv Joueur " + game.pvPlayer);
        document.write (`<figcaption>${game.pvPlayer} PV</figcaption>`)
    } else {
        console.log("Game Over !");
        document.write (`<figcaption> Game Over !!</figcaption>`)
    }
    document.write (`</figure>`)
    
    // game.hpPlayer <= 0
    // Le joueur est mort, on affiche 'GAME OVER'
    document.write (`<figure class="game-state_player">
    <img src="images/dragon.png" alt="Dragon">`)
    
    if (game.pvDragon > 0) {
        console.log("pv Dragon " + game.pvDragon);
        document.write(`<figcaption>${game.pvDragon} PV</figcaption>`)
        
    } else {
        console.log("Game Over !");
        game.pvDragon = "Game Over !"
        document.write(`<figcaption> Game Over ! </figcaption>`)
    }
    document.write (`</figure>`)
    document.write(`</div>`)

    // Affichage de l'état du dragon

    // Si le dragon est toujours vivant on affiche ses points de vie

    // game.hpDragon <= 0
    // Le dragon est mort on affiche 'GAME OVER'
}

/**
 * Affiche ce qu'il s'est passé lors d'un tour du jeu : qui a attaqué ? Combien de points de dommage ont été causés ?
 * @param {string} attacker - Qui attaque : DRAGON ou PLAYER
 * @param {number} damagePoints - Le nombre de points de dommage causés
 */
function showGameLog(attacker, damagePoints) {
    // Si c'est le dragon qui attaque...
    if (attacker === "dragon") {
        console.log(
            "Le dragon prend l'initiative, vous attaque et vous inflige " +
                damagePoints +
                " points de dommage !"
        );
        game.attackerImg = "images/dragon-winner.png"
        game.attackerTxt = "Le dragon prend l'initiative, vous attaque et vous inflige"
        // attacker == PLAYER
    } else {
        console.log(
            // "Vous êtes le plus rapide, vous attaquez le dragon et lui infligez " +
            //     damagePoints +
            //     " points de dommage !"
        );
        game.attackerImg = "images/knight.png"
        game.attackerTxt = "Vous êtes le plus rapide, vous attaquez le dragon et lui infligez " 
    }

    // Affichage des informations du tour dans le document HTML
}

/**
 * Affichage du vainqueur
 */
function showGameWinner() {
    // Si les points de vie du dragon sont positifs, c'est qu'il est toujours vivant, c'est donc lui qui a gagné le combat
    // Sinon (le dragon est mort) c'est le joueur qui a gagné
    document.write (`<footer>
    <h3>Fin de la partie</h3>
    <figure class="game-end">`)
    if (game.pvDragon < 0) {
        console.log("Le joueur à gagné !");
        document.write(`<figcaption>Vous avez gagné carbonisé le dragon!</figcaption>
    <img src="images/knight-winner.png" alt="Dragon vainqueur">`)
    } else {
        console.log("Le dragon à gagné");
    document.write(`<figcaption>Vous avez perdu le combat, le dragon vous a carbonisé !</figcaption>
    <img src="images/dragon-winner.png" alt="Dragon vainqueur">`)
    }
}
    document.write(`</figure></footer></div>`)



/**
 * Fonction principale du jeu qui démarre la partie
 */
function startGame() {
    // Etape 1 : initialisation du jeu
    initializeGame();
    // Etape 2 : exécution du jeu, déroulement de la partie
    gameLoop();
    // Fin du jeu, affichage du vainqueur
    showGameWinner();
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
startGame();
