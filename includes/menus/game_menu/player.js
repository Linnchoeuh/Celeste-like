import {ctx, Tools, GV, Keyboard, Fps, GameMenu, Pause} from "../../../main.js";
import {Timer_Log} from "../../tools.js";

function texture_loader(path)
{
    var texture = new Image();
    texture.src = path;
    return texture;
}

class Player_Data
{
    constructor()
    {
        this.PhysicsLoop = new Timer_Log();
        this.DisplayLoop = new Timer_Log();
        this.physics_loop_log = 0;
        this.display_loop_log = 0;
        
        this.x = 0;
        this.y = 0;
        this.interpo_x = 0
        this.interpo_y = 0
        this.interpoled_x = 0
        this.interpoled_y = 0
        this.positionning_x = 0;
        this.positionning_y = 0;
        this.vector_X = 0;
        this.vector_Y = 0;
        this.previous_x = 0;
        this.previous_y = 0;
        this.jump = false;
        this.jumpavaiblelity = true;
        this.releasejump = false;
        this.jumpcount = 0;
        this.left = true;
        this.right = true;
        this.walljump = 0;
        this.walljumpcheck = false;

        this.hit_box_scaler = 0
        this.horizontal_hit_box = 10;
        this.horizontal_hit_box_offset = 7;
        this.vertical_hit_box = 24;
        this.vertical_hit_box_offset = 0;

        this.adapted_horizontal_hit_box = 0;
        this.adapted_horizontal_hit_box_offset = 0;
        this.adapted_vertical_hit_box = 0;
        this.adapted_vertical_hit_box_offset = 0;
        this.pre_player_scaling = 70;
        
        
        this.lastdirection = 1;
        this.cachedata;
        this.lastactwalljump = false;
        
        this.dashcount = 0; //(Ne pas toucher)
        this.dashcooldown = 0; //(Ne pas toucher)
        this.dashbuttonrelease = true; //Oblige le joueur a relacher la touche du dash entre chaque dash
        this.dashspeed = 36; //Permet d'ajuster la vitesse du dash par frame (valeures admises [0;+inf[)
        this.dashduration = 10; //Permet d'ajuster durée en nombre de frame du dash (valeures admises [0;+inf[)
        this.dashcooldownmax = 30; //Permet d'empècher de dash a l'infini (valeures admises [0;+inf[)
        this.dashend = 10; //choisir la vitesse du joeur a la fin du dash (valeures admises [0;70])
        

        

        this.jumpforce = 30; //Puissance du saut (valeures admises ]0;+inf[)
        this.jumptolerance = -10; //Permet de sauter un peu après ne plus avoir touché le block (valeures admises ]-inf;0])
        this.jumpattenuation = 1.5; // Vitesse a laquelle le joueur ralenti dans ca monté lorsque la touche saut est relaché avant son apogé 
                                    // (valeures admises [1;+inf[) plus la valeure est vers l'inf plus le ralentissement sera prononcé
        
        this.maxcurrentvelocity; //La fameuse (Ne pas toucher)
        this.currentacceleration;
        this.groundacceleration = 1.5;
        this.aerialacceleration = 0.5;
        this.maxgroundvelocity = 9; //Vitesse max de déplacement du joueur lorsqu'il est au sol (valeures admises [0;70]) 0 équivaut a pas déplacment au sol
        this.maxaerialvelocity = 9; //Vitesse max de déplacement du joueur lorsqu'il est en chute libre (valeures admises [0;70]) 0 équivaut a pas déplacment en l'air
        this.aerialmoving = 0.5; //Pour pouvoir se diriger dans les airs, si la valeure est trop élevé on peut faire des walljump sur un seul mur mdr 
                                //(valeures admises [0;+inf[) 0 équivaut a pas déplacment en l'air
        
        this.wallleavemax = 5; //Nombre de frame requise pour quitter un mur lorsque qu'on est en position pour faire un walljump (valeures admises ]0;+inf[)
        this.wallleave = this.wallleavemax+1; //(Ne pas toucher)
        this.walljumpx = 15; //(valeures admises [0;70]) 0 équivaut a pas déplacment horizontal
        this.walljumpy = 25; //(valeures admises [0;70]) 0 équivaut a pas déplacment vertical
        this.walljumpslide = 4; //Vitesse de chute lorsque que le personnage est en position pour walljump (valeures admises [0;70]) 0 équivaut a pas de chute

        this.groundfriction = 0.8; //Ralentissement de la vitesse joueur lorsqu'il est au sol (valeures admises ]0;+inf[)
        this.airfriction = 0.2; //Ralentissement de la vitesse joueur lorsqu'il est en l'air (valeures admises ]0;+inf[)
        
        
        this.gravity = 1.5; //Permet d'ajuster la vitesse de chute du joueur (valeures admises ]0;70])
        this.maxgravityspeed = 20; //Permet de donner une vitesse de chute max (ne jamais dépasser 70px/frame) (valeures admises ]0;70])



        //Variables d'animations du joueur
        this.initial_pose = texture_loader("graphics/player/initial_pose/initial_pose.png");
        
        this.animationmoving = false;
        this.moving = texture_loader("graphics/player/moving/moving.png");
        this.movingrightframetiminglist = [0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5];
        this.movingrightframe = 0;
        this.movingleftframetiminglist = [6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 10, 11, 11];
        this.movingleftframe = 0;
        this.movingframetiminglistlen = this.movingrightframetiminglist.length;
        this.wall_slide = texture_loader("graphics/player/wall_slide/wall_slide.png");
        
        this.verticaldirection = -1;
        this.falling = texture_loader("graphics/player/falling/falling.png");
        this.fallingrightframetiminglist = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
        this.fallingleftframetiminglist = [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3];
        this.fallingframe = 0;
        this.fallingframetiminglistlen = this.fallingrightframetiminglist.length;

        this.ground_slideposition = 0;
        this.ground_slide = texture_loader("graphics/player/ground_slide/ground_slide.png");

        this.jumpframe = 0;
        this.jump_animation_postion = 0;
        this.jumprightframetiminglist = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
        this.jumpleftframetiminglist = [4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5];
        this.jump_animation = texture_loader("graphics/player/jump/jump.png");
        this.jumpframetiminglistlen = this.jumprightframetiminglist.length;

        this.dashaanimation = texture_loader("graphics/player/dash/dash.png");

        // collisions.Bottom = en dessous
        // collisions.Top = au dessus
        // collisions.Left = a ca gauche
        // collisions.Right = a ca droite
        // collisions[4] = pré en dessous
        // collisions[5] = pré au dessus
        // collisions[6] = pré a ca gauche
        // collisions[7] = pré a ca droite

        // Keyboard.keys_input.z = z
        // Keyboard.keys_input.q = q
        // Keyboard.keys_input.s = s
        // Keyboard.keys_input.d = d
        // Keyboard.keys_input.space = space
        // Keyboard.keys_input.shift = maj
        // input[6] = p  (reservé)
        // input[7] = c  (reservé)
        // Keyboard.keys_input.return = enter
        // input [9] = escape (reservé)

        this.godmode_speed_vector = 10;
    }

    // spawn(coords){
    //     this.x = coords[0];
    //     this.y = coords[1]-1;
    // }

    modifyHitBox(ratio, x_hitbox = 24, x_offset = 0, y_hitbox = 24, y_offset = 0){
        this.hit_box_scaler = ratio
        this.adapted_horizontal_hit_box        = x_hitbox*this.hit_box_scaler;
        this.adapted_horizontal_hit_box_offset = x_offset*this.hit_box_scaler;
        this.adapted_vertical_hit_box          = y_hitbox*this.hit_box_scaler;
        this.adapted_vertical_hit_box_offset   = y_offset*this.hit_box_scaler;
    }

    playerPositionner(pos, offset){
        return pos - offset
    }

    velocity(collisions, offsetX_on, offsetY_on, distanceground){
        this.PhysicsLoop.startTime()
        // this.x = Math.round(this.x)
        // this.y = Math.round(this.y)
        if(Pause.pause === false)
        {     
            this.ground_slideposition = 0;
            this.jump_animation_postion = 0;
            if(GV.godmode === false)
            {
                if(this.wallleave >= this.wallleavemax) //moving
                {   
                    if(Keyboard.keys_input.q !== Keyboard.keys_input.d)
                    {
                        this.animationmoving = true;
                        switch(collisions.Bottom)
                        {
                            case false:
                                this.maxcurrentvelocity = this.maxaerialvelocity;
                                this.currentacceleration = this.aerialacceleration;
                                break
                            case true:
                                this.maxcurrentvelocity = this.maxgroundvelocity;
                                this.currentacceleration = this.groundacceleration;
                                break
                        }
                    }
                    else
                    {
                        this.maxcurrentvelocity = 0;
                        this.animationmoving = false;
                    }
                    
                    if(this.dashcount === 0) //no move
                    {
                        
                        if(this.vector_X > 0 || collisions.Right) //Ralenti si le perso allait a droite
                        {
                            switch(collisions.Bottom)
                            {
                                case true:
                                    this.vector_X -= this.groundfriction;
                                    
                                    if(Keyboard.keys_input.q && collisions.Right === false)
                                    {
                                        this.ground_slideposition = -1;
                                    }
                                    break;
                                case false:
                                    this.vector_X -= this.airfriction;
                                    if(Keyboard.keys_input.q)
                                    {
                                        this.vector_X -= this.aerialmoving;
                                    }
                                    break;
                            }
                            if(this.vector_X < 0 || collisions.Right)
                            {
                                this.vector_X = 0;
                            }
                        }
                        else if(this.vector_X < 0 || collisions.Left) //Ralenti si le perso allait a gauche
                        {
                            switch(collisions.Bottom)
                            {
                                case true:
                                    this.vector_X += this.groundfriction;
                                    if(Keyboard.keys_input.d && collisions.Left === false)
                                    {
                                        this.ground_slideposition = 1;
                                    }
                                    break;
                                case false:
                                    this.vector_X += this.airfriction;
                                    if(Keyboard.keys_input.d)
                                    {
                                        this.vector_X += this.aerialmoving;
                                    }
                                    break;
                            }
                            if(this.vector_X > 0 || collisions.Left)
                            {
                                this.vector_X = 0;
                            }
                        }
                    }

                    if(Keyboard.keys_input.d && Keyboard.keys_input.q === false && collisions.Bottom || this.vector_X > 0 && collisions.Bottom === false) //moving right
                    {
                        this.lastdirection = 1;
                    }
                    else if(Keyboard.keys_input.q && Keyboard.keys_input.d === false && collisions.Bottom || this.vector_X < 0 && collisions.Bottom === false)
                    {
                        this.lastdirection = -1;
                    }
                    if     (Keyboard.keys_input.d && Keyboard.keys_input.q === false && this.vector_X >= 0 && collisions.Right === false && this.vector_X < this.maxcurrentvelocity) //moving right
                    {
                        this.speed = this.vector_X += this.currentacceleration;
                        if(this.vector_X > this.maxcurrentvelocity)
                        {
                            this.speed = this.vector_X = this.maxcurrentvelocity;
                        }

                    }
                    else if(Keyboard.keys_input.q && Keyboard.keys_input.d === false && this.vector_X <= 0 && collisions.Left === false && this.vector_X > -this.maxcurrentvelocity) //moving left
                    {
                        this.speed = this.vector_X -= this.currentacceleration;
                        if(this.vector_X < -this.maxcurrentvelocity)
                        {
                            this.speed = this.vector_X = -this.maxcurrentvelocity;
                        }
                    }
                }
                
                if(Keyboard.keys_input.space && collisions.Top === false && this.walljump === 0 && this.releasejump === true && this.jump === true || 
                    this.vector_Y <= this.jumptolerance && this.releasejump === true && Keyboard.keys_input.space && this.walljump === 0 && this.jumpavaiblelity === true) //jump
                {
                    this.vector_Y = -this.jumpforce;
                    this.releasejump = false;
                    this.jump_animation_postion = 1;
                    this.jumpavaiblelity = false
                    this.walljumpcheck = false;
                }
                else if(this.vector_Y < 0)
                {
                    this.jump_animation_postion = 2;
                }

                if(Keyboard.keys_input.space === false && this.walljumpcheck === false) //block the walljump if the spacebar was not released when the player touch the wall
                {
                    this.walljumpcheck = true;
                }
                if(collisions.Bottom === false && this.vector_Y >= 0 || this.lastactwalljump === true) //walljump
                {
                    if(collisions.Left && distanceground > 71 || collisions.Left && distanceground === false) //left
                    {
                        this.walljump = -1;
                    }
                    else if(collisions.Right && distanceground > 71 || collisions.Right && distanceground === false) //right
                    {
                        this.walljump = 1;
                        this.vector_X = 1
                    }
                    else //nothing
                    {
                        this.walljump = 0;
                        this.wallleave = this.wallleavemax;
                    }
                    if(this.walljump !== 0)
                    {
                        if(this.walljump === 1 || this.walljump === -1)
                        {
                            this.vector_Y = this.walljumpslide;
                            this.jump = false;
                        }
                        if(Keyboard.keys_input.q || Keyboard.keys_input.d)
                        {
                            this.wallleave += 1;
                            if(Keyboard.keys_input.d)
                            {
                                this.lastdirection = 1;
                            }
                            else if(Keyboard.keys_input.q)
                            {
                                this.lastdirection = -1;
                            }
                        }
                        else
                        {
                            this.wallleave = 0;
                        }
                        
                        if(this.walljumpcheck === true && collisions.Bottom === false && collisions.Top === false && Keyboard.keys_input.space)
                        {
                            this.vector_X = -this.walljump*this.walljumpx;
                            this.vector_Y = -this.walljumpy;
                            this.lastdirection = -this.walljump*1;
                            
                            this.jump = false;
                            this.walljump = 0;
                            this.walljumpcheck = false;
                            this.wallleave = this.wallleavemax;
                            this.dashcooldown = this.dashcooldownmax;
                            this.lastactwalljump = true;
                        }
                    }
                    else if(this.walljump !== 1 && this.walljump !== -1)
                    {
                        this.wallleave = this.wallleavemax;
                        this.jump = false;
                    }
                }
                
                if(this.dashbuttonrelease === false && Keyboard.keys_input.shift === false) // dash
                {
                    this.dashbuttonrelease = true;
                }
                if(this.dashcooldown === 0 && this.lastactwalljump === false)
                {    
                    if(Keyboard.keys_input.shift && this.dashbuttonrelease === true || this.dashcount !== 0)
                    {
                        if(this.dashcount === 0)
                        {
                            this.dashbuttonrelease = false;
                        }
                        this.dashcount += 1
                        if(this.dashcount >= this.dashduration || collisions.Left && this.vector_X < 0 || collisions.Right && this.vector_X > 0)
                        {
                            this.vector_X = this.dashend*this.lastdirection;
                            this.vector_Y = 0;
                            this.dashcooldown = this.dashcooldownmax;
                            this.dashcount = 0;
                        }
                        else
                        {
                            this.vector_X = this.dashspeed*this.lastdirection;
                            this.vector_Y = 0;
                        }    
                    }
                }
                if(this.dashcooldown > 0)
                {
                    this.dashcooldown -= 1;
                }

                if(this.walljump === 0 && this.dashcount === 0) //gravity
                {
                    if(collisions.Top)
                    {
                        this.vector_Y = 0;
                        this.jump = false;
                    }
                    if(Keyboard.keys_input.space === false && this.vector_Y < 0 && this.lastactwalljump === false)
                    {
                        this.vector_Y /= this.jumpattenuation;
                        this.jump = false;
                    }
                    if(this.maxgravityspeed > this.vector_Y)
                    {
                        this.vector_Y += this.gravity;
                    }
                }

                if(collisions.Bottom && this.jump === false)
                {
                    this.wallleave = this.wallleavemax;
                    this.jump = true;
                    this.lastactwalljump = false;
                    this.jumpavaiblelity = true;
                    
                }
                if(Keyboard.keys_input.space === false)
                {
                    this.releasejump = true;
                }
                
            }
            else //movement in godmode
            {    
                
                if(Keyboard.keys_input.return)
                {
                    this.godmode_speed_vector = 1;
                }
                else if(Keyboard.keys_input.shift)
                {
                    this.godmode_speed_vector = 120;
                }
                else
                {    
                    this.godmode_speed_vector = 10;
                }
                if(Keyboard.keys_input.z && Keyboard.keys_input.s === false) //up
                {
                    this.vector_Y = -this.godmode_speed_vector;
                }
                else if(Keyboard.keys_input.s && Keyboard.keys_input.z === false) //down
                {
                    this.vector_Y = this.godmode_speed_vector;
                }
                else //neutral y
                {
                    this.vector_Y = 0;
                }
                if(Keyboard.keys_input.d && Keyboard.keys_input.q === false) //right
                {
                    this.vector_X = this.godmode_speed_vector;
                }
                else if(Keyboard.keys_input.q && Keyboard.keys_input.d === false) //left
                {
                    this.vector_X = -this.godmode_speed_vector;
                }
                else //neutral x
                {
                    this.vector_X = 0;
                }
            }
            
            this.x += this.vector_X;
            this.y += this.vector_Y;
        }
        this.physics_loop_log = this.PhysicsLoop.endLogTime(300*(GameMenu.physics_speed/60));
    }
    
    display(offset_x, offset_y, difference_x, difference_y)
    {
        this.DisplayLoop.startTime();
        this.interpoled_x           = this.x+this.interpo_x*Fps.nbofframewithoutphysics;
        this.interpoled_y           = this.y+this.interpo_y*Fps.nbofframewithoutphysics;
        if(GV.camsmootherenable)
        {
            this.positionning_x         = Tools.resolutionScaler(this.playerPositionner(this.interpoled_x, offset_x));
            this.positionning_y         = Tools.resolutionScaler(this.playerPositionner(this.interpoled_y, offset_y));
        }else{
            this.positionning_x         = Tools.resolutionScaler(this.playerPositionner(this.interpoled_x-difference_x, offset_x));
            this.positionning_y         = Tools.resolutionScaler(this.playerPositionner(this.interpoled_y-difference_y, offset_y));
        };
        ctx.drawImage(this.initial_pose, 0, 0, 24, 24, this.positionning_x, this.positionning_y, this.pre_player_scaling, this.pre_player_scaling);

        // switch(this.walljump)
        // {
        //     case 1:
        //         ctx.drawImage(this.wall_slide, 0, 0, 24, 24, Tools.resolutionScaler(this.x), Tools.resolutionScaler(this.y), this.pre_player_scaling, this.pre_player_scaling);
        //         break;
        //     case -1:
        //         ctx.drawImage(this.wall_slide, 24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //         break;
        //     case 0:
        //         switch(this.lastdirection)
        //         {
        //             case 1:
        //                 if(this.dashcount === 0)
        //                 { 
        //                     if(collisions.Bottom)
        //                     {    
        //                         if(this.animationmoving === true && collisions.Right === false && this.ground_slideposition === 0)
        //                         {       
        //                             this.movingleftframe = 0;
        //                             ctx.drawImage(this.moving, this.movingrightframetiminglist[Math.floor(this.movingrightframe)]*24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.movingrightframe += 1/dt;
        //                             }
        //                             if(this.movingrightframe >= this.movingframetiminglistlen)
        //                             {
        //                                 this.movingrightframe = 0;
        //                             }
        //                         }
        //                         else if(this.ground_slideposition === 1)
        //                         {
        //                             ctx.drawImage(this.ground_slide, 24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                         else
        //                         {
        //                             this.movingrightframe = 0;
        //                             ctx.drawImage(this.initial_pose, 24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                     }
        //                     else
        //                     {
        //                         if(this.verticaldirection === -1 && this.jump_animation_postion === 0)
        //                         {
        //                             ctx.drawImage(this.falling, this.fallingrightframetiminglist[Math.floor(this.fallingframe)]*24, 0, 24, 24, Tools.resolutionScaler(this.x), Tools.resolutionScaler(this.y), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.fallingframe += 1/dt;
        //                             }
        //                             if(this.fallingframe >= this.fallingframetiminglistlen)
        //                             {
        //                                 this.fallingframe = 0;
        //                             }
        //                         }
        //                         else if(this.jump_animation_postion === 1)
        //                         {
        //                             this.jumpframe = 0;
        //                             ctx.drawImage(this.jump_animation, 0, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                         else if(this.jump_animation_postion === 2)
        //                         {
        //                             ctx.drawImage(this.jump_animation, this.jumprightframetiminglist[Math.floor(this.jumpframe)]*24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.jumpframe += 1/dt;
        //                             }
        //                             if(this.jumpframe >= this.jumpframetiminglistlen)
        //                             {
        //                                 this.jumpframe = 0;
        //                             }
        //                         }
        //                     }
        //                 }
        //                 else
        //                 {
        //                     ctx.drawImage(this.dashaanimation, 0, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                 }
        //                 break
        //             case -1:
        //                 if(this.dashcount === 0)
        //                 {    
        //                     if(collisions.Bottom)
        //                     {
        //                         if(this.animationmoving === true && collisions.Left === false && this.ground_slideposition === 0)
        //                         {
        //                             this.movingrightframe = 0;
        //                             ctx.drawImage(this.moving, this.movingleftframetiminglist[Math.floor(this.movingleftframe)]*24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.movingleftframe += 1/dt;
        //                             }
        //                             if(this.movingleftframe >= this.movingframetiminglistlen)
        //                             {
        //                                 this.movingleftframe = 0;
        //                             }
        //                         }
        //                         else if(this.ground_slideposition === -1)
        //                         {
        //                             ctx.drawImage(this.ground_slide, 0, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                         else
        //                         {
        //                             this.movingleftframe = 0;
        //                             ctx.drawImage(this.initial_pose, 0, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                     }
        //                     else
        //                     {
        //                         if(this.verticaldirection === -1 && this.jump_animation_postion === 0)
        //                         {
        //                             ctx.drawImage(this.falling, this.fallingleftframetiminglist[Math.floor(this.fallingframe)]*24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.fallingframe += 1/dt;
        //                             }
        //                             if(this.fallingframe >= this.fallingframetiminglistlen)
        //                             {
        //                                 this.fallingframe = 0;
        //                             }
        //                         }
        //                         else if(this.jump_animation_postion === 1)
        //                         {
        //                             this.jumpframe = 0;
        //                             ctx.drawImage(this.jump_animation, 72, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                         }
        //                         else if(this.jump_animation_postion === 2)
        //                         {
        //                             ctx.drawImage(this.jump_animation, this.jumpleftframetiminglist[Math.floor(this.jumpframe)]*24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                             if(Pause.pause === false)
        //                             {
        //                                 this.jumpframe += 1/dt;
        //                             }
        //                             if(this.jumpframe >= this.jumpframetiminglistlen)
        //                             {
        //                                 this.jumpframe = 0;
        //                             }
        //                         }
        //                     }
        //                 }
        //                 else
        //                 {
        //                     ctx.drawImage(this.dashaanimation, 24, 0, 24, 24, Tools.resolutionScaler(px+camsmootherX), Tools.resolutionScaler(py+camsmootherY), this.pre_player_scaling, this.pre_player_scaling);
        //                 }
        //                 break
        //         }
        //         break
        // }
        this.display_loop_log = this.DisplayLoop.endLogTime();
    }

    reset()
    {

    }
}

export{Player_Data};