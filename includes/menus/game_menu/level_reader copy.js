import {ctx, GV, Tools, Player} from "../../../main.js";
import {Timer_Log} from "../../tools.js";

var testblock = new Image();
testblock.src = "graphics/map_content/test_block.png";


var a = 0;






class Map_Data
{   
    constructor()
    {
        this.map_limit = {"x" : 0, "y" : 0};
        this.spawn = {"x" : 0, "y" : 0};
        // this.map = {}
        this.offsetY = 0;
        this.offsetX = 0;
        this.previousoffsetX = 0;
        this.previousoffsetY = 0;
        this.offsetX_on = 0;
        this.offsetY_on = 0;
        this.cache_data = 0;
        this.collisions = {"Top" : true, "Bottom" : true, "Left" : true, "Right" : true};
        this.top_collisions_map = [];
        this.bottom_collisions_map = [];
        this.left_collisions_map = [];
        this.right_collisions_map = [];

        this.maxi = 0; //Potentiellement suprimé bientôt
        this.i_define = 0;

        this.block_map = [0]
        this.block_map_snap_position = [0]
        this.block_index = [0]
        this.index_value = 0;
        this.block_map_type_texture = [0]
        this.all_block_map_count = 0;
        this.operation_count = 0;

        //Camera smoother
        this.player_vect_x = 0;
        this.player_vect_y = 0;

        //Optimisation
        this.pre_block_scale = 24;
        this.original_block_scale = 70;
        this.original_block_scale_graphical_scaled = this.original_block_scale;
        this.pre_block_scaling = this.original_block_scale;
        this.pre_block_scaling_unround = this.original_block_scale;
        this.pre_snap_offset_smooth_X = 0;
        this.pre_snap_offset_smooth_Y = 0;
        this.pre_snap_offset_smooth_X_minus_05 = 0;
        // this.pre_snap_offset_smooth_Y_minus_05 = 0;
        this.pre_vertical_position_line_block_displayed = 0;


        this.stock = [];
        this.collisions_calculation_divider = 0;
        this.a = 0;
        this.bestup = [false,false,false,false]; //mise a 0 des variable qui enregistre la position des blocs sujets a une possible collision
        this.bestdown = [false,false,false,false,false]; // ordre px,py;ox,oy
        this.bestleft = [false,false,false,false];
        this.bestright = [false,false,false,false];
        this.previousoffset = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
        this.camsmoother = [0, 0];
        this.previouscamsmoother = [0,0];
        this.level_data_textures = [];
        this.data_temp = [];
        this.bg = Tools.textureLoader("graphics/map_content/background.png");
        this.grass_blocks = Tools.textureLoader("graphics/map_content/harmonic_grass.png");
        this.testblock = Tools.textureLoader("graphics/map_content/test_block.png");
        this.CollisionsLoop = new Timer_Log();
        this.GraphicsLoop = new Timer_Log();
        this.CamSmootherLoop = new Timer_Log();
        this.collisions_loop_log = 0;
        this.graphics_loop_log = 0;
        this.cam_smoother_loop_log = 0;

        this.pre_part_calculed_horizontal_start_square_collisions_test_area = 0;
        this.pre_part_calculed_horizontal_end_square_collisions_test_area   = 0;
        this.pre_part_calculed_vertical_start_square_collisions_test_area   = 0;
        this.pre_part_calculed_vertical_end_square_collisions_test_area     = 0;
        this.start_square_collisions_test_area = [0, 0];
        this.end_square_collisions_test_area   = [0, 0];


    }



    start(file, editedlevelid)
    {
        this.collisions = {"Top" : true, "Bottom" : true, "Left" : true, "Right" : true}
        this.top_collisions_map = [];
        this.bottom_collisions_map = [];
        this.left_collisions_map = [];
        this.right_collisions_map = [];
        this.map_limit = file.MapDatas[editedlevelid].Map_limit;
        this.spawn = file.MapDatas[editedlevelid].Player_spawn;
        this.all_block_map_count = file.MapDatas[editedlevelid].Blocks.length;
        Player.modifyHitBox(this.original_block_scale/this.pre_block_scale, 10, 7)
        
        console.log(file.MapDatas[editedlevelid])

        
        // Préparation des collisions de la map
        for(let i = 0; i < this.map_limit.y+1; i++){
            this.top_collisions_map.push([]);
            this.bottom_collisions_map.push([]);
            this.left_collisions_map.push([]);
            this.right_collisions_map.push([]);
            for(let k = 0; k < this.map_limit.x+1; k++){
                this.top_collisions_map[i].push(false);
                this.bottom_collisions_map[i].push(false);
                this.left_collisions_map[i].push(false);
                this.right_collisions_map[i].push(false);
            }
        }

        for(let i = 0; i < this.all_block_map_count; i++){
            this.top_collisions_map[file.MapDatas[editedlevelid].Blocks[i].y][file.MapDatas[editedlevelid].Blocks[i].x] = file.MapDatas[editedlevelid].Blocks[i].Collisions.Top;
            this.bottom_collisions_map[file.MapDatas[editedlevelid].Blocks[i].y][file.MapDatas[editedlevelid].Blocks[i].x] = file.MapDatas[editedlevelid].Blocks[i].Collisions.Bottom;
            this.left_collisions_map[file.MapDatas[editedlevelid].Blocks[i].y][file.MapDatas[editedlevelid].Blocks[i].x] = file.MapDatas[editedlevelid].Blocks[i].Collisions.Left;
            this.right_collisions_map[file.MapDatas[editedlevelid].Blocks[i].y][file.MapDatas[editedlevelid].Blocks[i].x] = file.MapDatas[editedlevelid].Blocks[i].Collisions.Right;
        }
    
        console.log(this.top_collisions_map);


        // Postionement du joueur et de la caméra
        Player.playerX = (1200-this.original_block_scale)/2;
        this.offsetX = this.spawn.x*this.original_block_scale-Player.playerX;
        
        if(this.offsetX < 0)
        {
            this.offsetX = 0;
            this.offsetX_on = -1;
            Player.playerX = this.spawn.x*this.original_block_scale;
        }
        else if(this.offsetX > this.map_limit.x*this.original_block_scale-1200-this.original_block_scale)
        {
            this.offsetX = this.map_limit.x*this.original_block_scale-1200-this.original_block_scale;
            this.offsetX_on = 1;
            Player.playerX = (1200-this.original_block_scale)-(this.map_limit.x-this.spawn.x)*this.original_block_scale;
            
        }
        var py = (675-this.original_block_scale)/2;
        this.offsetY = this.spawn.y*this.original_block_scale-py;
        
        if(this.offsetY < 0)
        {
            this.offsetY = 0;
            this.offsetY_on = -1;
            py = this.spawn.y*this.original_block_scale;
        }
        else if(this.offsetY > this.map_limit.y*this.original_block_scale-(675-this.original_block_scale)) //down
        {
            this.offsetY = this.map_limit.y*this.original_block_scale-(675-this.original_block_scale);
            this.offsetY_on = 1;
            py = (675-this.original_block_scale)-(this.map_limit.y-this.spawn.y)*this.original_block_scale;
        }
        
        this.previousoffset = [[this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY],
                               [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY],
                               [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY],
                               [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY], [this.offsetX, this.offsetY]];
        
        // console.log(Player.playerX,py);

        // Préparation de l'affichage de la map
        this.block_map = [];
        this.block_map_type_texture = [];
        this.block_index = [];
        this.block_map_snap_position = [];
        for(let i = 0; i < this.map_limit.y+1; i++){
            this.block_map_type_texture.push({});
            this.block_map.push([]);
            this.block_index.push([]);
            this.block_map_snap_position.push([]);
        }
        
        for(let i = 0; i < this.all_block_map_count; i++){
            this.block_map[file.MapDatas[editedlevelid].Blocks[i].y].push(file.MapDatas[editedlevelid].Blocks[i].x*this.pre_block_scaling);
            this.block_map_snap_position[file.MapDatas[editedlevelid].Blocks[i].y].push(file.MapDatas[editedlevelid].Blocks[i].x);
            this.block_map_type_texture[file.MapDatas[editedlevelid].Blocks[i].y][file.MapDatas[editedlevelid].Blocks[i].x] = Object.values(file.MapDatas[editedlevelid].Blocks[i].Type);
            this.block_map[file.MapDatas[editedlevelid].Blocks[i].y].sort(function(a, b) {return a - b;});
            this.block_map_snap_position[file.MapDatas[editedlevelid].Blocks[i].y].sort(function(a, b) {return a - b;});
        }
        
        for(let i = 0; i < this.map_limit.y+1; i++){
            this.index_value = 0;
            for(let k = 0; k < this.map_limit.x+1; k++){
                this.block_index[i].push(this.index_value)
                if(k >= this.block_map[i][this.index_value]/this.pre_block_scaling && this.index_value < this.block_map[i].length-1){
                    this.index_value++;
                }
            }
        }
        for(let i = 0; i < this.block_map_type_texture.length; i++){
            this.cache_data = [];
            for(let k = 0; k < this.block_map_snap_position[i].length; k++){
                this.cache_data.push(this.block_map_type_texture[i][this.block_map_snap_position[i][k]]);
            }
            this.block_map_type_texture[i] = this.cache_data
        }
        console.log(this.block_map)
        console.log(this.block_map_snap_position)
        console.log(this.block_index)
        console.log(this.block_map_type_texture)
        
        this.requiredDisplayVariableUpdater();
        return [Player.playerX, py];
    }

    collider(pause)
    {
        this.CollisionsLoop.startTime();
        if(pause === false)    
        {    
            this.collisions = [0,0,0,0,0,0,0,0];


            if(this.collisions[0] == 1)
            {
                this.offsetX = Math.round(this.offsetX);
            }
            if(Player.playerX > 576 & this.offsetX_on == -1 | this.offsetX_on == 0 | Player.playerX < 576 & this.offsetX_on == 1) //Camera X
            { 
                if(this.offsetX >= 0 & this.offsetX <= this.map_limit.x*this.original_block_scale-(1200-this.original_block_scale)) // X offset
                {
                    this.offsetX += Player.vector_X;
                    this.offsetX_on = 0;
                    Player.playerX = 576;
                    if(this.offsetX < 1) //left
                    {
                        this.offsetX_on = -1;
                    }
                    else if(this.offsetX > this.map_limit.x*this.original_block_scale-(1200-this.original_block_scale)) //right
                    {
                        this.offsetX_on = 1
                    }
                }
                if(this.offsetX < 0) //replacer camera si elle sort du cadre
                {
                    this.offsetX = 0;
                }
                else if(this.offsetX > this.map_limit.x*this.original_block_scale-(1200-this.original_block_scale))
                {
                    this.offsetX = this.map_limit.x*this.original_block_scale-(1200-this.original_block_scale);
                }
            }

            if(Player.playerY > 324 & this.offsetY_on == -1 | this.offsetY_on == 0 | Player.playerY < 324 & this.offsetY_on == 1) //Camera Y
            {    
                if(this.offsetY >= 0 & this.offsetY <= this.map_limit.y*this.original_block_scale-(675-this.original_block_scale)) // Y offset
                {
                    this.offsetY += Player.vector_Y;
                    this.offsetY_on = 0;
                    Player.playerY = 324;
                    if(this.offsetY < 1) //up
                    {
                        this.offsetY_on = -1;
                        Player.playerY = 324+Player.vector_Y;
                    }
                    else if(this.offsetY > this.map_limit.y*this.original_block_scale-(675-this.original_block_scale)) //down
                    {
                        this.offsetY_on = 1;
                        Player.playerY = 324+Player.vector_Y;
                    }
                }
                if(this.offsetY < 0) //replacer camera si elle sort du cadre
                {
                    this.offsetY = 0;
                }
                else if(this.offsetY > this.map_limit.y*this.original_block_scale-(675-this.original_block_scale))
                {
                    this.offsetY = this.map_limit.y*this.original_block_scale-(675-this.original_block_scale);
                }
            }
            
            // block the player moving when he reach a border of the canvas
            if(Player.playerX+Player.hit_box_offset < 0)
            {
                Player.playerX  = -Player.hit_box_offset;
                Player.vector_X = 0;
            }
            else if(Player.playerX+Player.hit_box_offset+Player.hit_box > 1200)
            {
                Player.playerX  = 1200-Player.hit_box_offset-Player.hit_box;
                Player.vector_X = 0;
            }
            if(Player.playerY > 675-this.original_block_scale-1)
            {
                Player.playerY  = 675-this.original_block_scale;
                this.collisions.splice(0, 1, 1);
            }
            else if(Player.playerY < 0)
            {
                Player.playerY  = 0;
                this.collisions.splice(1, 1, 1);
            }

            this.bestup = [false,false,false,false]; //mise a 0 des variable qui enregistre la position des blocs sujets a une possible collision
            this.bestdown = [false,false,false,false,false]; // ordre Player.playerX,py;ox,oy
            this.bestleft = [false,false,false,false];
            this.bestright = [false,false,false,false];
            this.player_vect_x = Player.vector_X;
            this.player_vect_y = Player.vector_Y;
            this.collisions_calculation_divider = 0;


            this.pre_part_calculed_horizontal_start_square_collisions_test_area = Player.playerX+this.offsetX+Player.hit_box_offset;
            this.pre_part_calculed_horizontal_end_square_collisions_test_area   = Player.playerX+this.offsetX+Player.hit_box_offset+Player.hit_box;
            if(Player.vector_X < 0)
            {
                this.pre_part_calculed_horizontal_start_square_collisions_test_area += Player.vector_X;
            }
            else if(Player.vector_X > 0)
            {
                this.pre_part_calculed_horizontal_end_square_collisions_test_area   += Player.vector_X;
            };
            this.pre_part_calculed_vertical_start_square_collisions_test_area   = Player.playerY+this.offsetY;
            this.pre_part_calculed_vertical_end_square_collisions_test_area     = Player.playerY+this.offsetY+this.original_block_scale;
            if(Player.vector_Y < 0)
            {
                this.pre_part_calculed_vertical_start_square_collisions_test_area   += Player.vector_Y;
            }
            else if(Player.vector_Y > 0)
            {
                this.pre_part_calculed_vertical_end_square_collisions_test_area     += Player.vector_Y;
            };
            this.start_square_collisions_test_area = [Math.trunc(this.pre_part_calculed_horizontal_start_square_collisions_test_area/this.original_block_scale), 
                                                      Math.trunc(this.pre_part_calculed_vertical_start_square_collisions_test_area  /this.original_block_scale)];
            this.end_square_collisions_test_area   = [Math.trunc(this.pre_part_calculed_horizontal_end_square_collisions_test_area  /this.original_block_scale), 
                                                      Math.trunc(this.pre_part_calculed_vertical_end_square_collisions_test_area    /this.original_block_scale)];

            

        }
        this.collisions_loop_log = this.CollisionsLoop.endLogTime();
        // return [Player.playerX, Player.playerY];
    }

    display(px, py, offsetX, offsetY, smoothX, smoothY)
    {
        this.GraphicsLoop.startTime()
        
        this.offsetsmoothX                     = Math.round(Tools.resolutionScaler(offsetX-this.camsmoother[0]));
        this.offsetsmoothY                     = Math.round(Tools.resolutionScaler(offsetY-this.camsmoother[1]));
        this.pre_snap_offset_smooth_X          = Math.round(this.offsetsmoothX/this.pre_block_scaling);
        this.pre_snap_offset_smooth_Y          = Math.round(this.offsetsmoothY/this.pre_block_scaling);
        this.pre_snap_offset_smooth_X_minus_05 = Math.round(this.offsetsmoothX/this.pre_block_scaling-0.5);
        // this.pre_snap_offset_smooth_Y_minus_05 = Math.round(this.pre_snap_offset_smooth_Y-0.5);
        if(GV.devmode){
            ctx.lineWidth = Tools.resolutionScaler(0.5*(this.original_block_scale/71));
            ctx.font      = Tools.resolutionScaler(15 *(this.original_block_scale/71))+'px arial';
        }
        this.i_define        = 0;
        this.operation_count = 0;
        ctx.drawImage(this.bg, 0, 0, canvas.width, canvas.height);
        if(this.i_define < this.pre_snap_offset_smooth_Y)
        {
            this.i_define = Math.round(Math.round(offsetY-smoothY)/this.original_block_scale-0.5)
        }
        for (let i = this.i_define; i < this.pre_snap_offset_smooth_Y+675/this.original_block_scale; i++) //Affichage des textures
        {
            if(i > this.map_limit.y){
                break;
            }
            this.pre_vertical_position_line_block_displayed = i*this.pre_block_scaling_unround-this.offsetsmoothY;
            this.index_value                                = this.block_index[i][this.pre_snap_offset_smooth_X_minus_05];
            for (let k = this.index_value; k < this.index_value+1200/this.original_block_scale+1; k++)
            {
                if(this.block_map_snap_position[i][k] >   this.pre_snap_offset_smooth_X+(1200/this.original_block_scale) 
                || this.block_map_snap_position[i][k] === this.block_map_snap_position[i][-1])
                {
                    if(GV.devmode){
                        ctx.fillStyle = "rgba(0,0,255,0.25)";
                        ctx.fillRect(this.block_map[i][k-1]-this.offsetsmoothX, this.pre_vertical_position_line_block_displayed, 
                                     this.pre_block_scaling,                    this.pre_block_scaling);
                    }
                    break;
                }
                switch(this.block_map_type_texture[i][k][0]) // selection des textures
                {
                    case 0:
                        ctx.drawImage(this.testblock, 
                                      this.block_map[i][k]-this.offsetsmoothX,                         this.pre_vertical_position_line_block_displayed, 
                                      this.pre_block_scaling,                                          this.pre_block_scaling); //testblock
                        break
                    case 1:
                        ctx.drawImage(this.grass_blocks, 
                                    ((this.block_map_type_texture[i][k][1]+4)%4)*this.pre_block_scale, Math.floor(this.block_map_type_texture[i][k][1]/4)*this.pre_block_scale, 
                                      this.pre_block_scale,                                            this.pre_block_scale, 
                                      this.block_map[i][k]-this.offsetsmoothX,                         this.pre_vertical_position_line_block_displayed, 
                                      this.pre_block_scaling,                                          this.pre_block_scaling);
                        break;
                }
                if(GV.devmode) //Affichage position de chaque block
                {
                    this.operation_count++;
                    ctx.lineWidth = Tools.resolutionScaler(0.01);
                    Tools.logText("["+this.block_map_snap_position[i][k]+" : "+i+"]", 
                                  this.block_map_snap_position[i][k]*this.original_block_scale-(offsetX-smoothX)+(5*(this.original_block_scale/71)), 
                                  i*this.original_block_scale-(offsetY-smoothY)+(20*(this.original_block_scale/71)));
                    Tools.logText("["+this.operation_count+"]", 
                                  this.block_map_snap_position[i][k]*this.original_block_scale-(offsetX-smoothX)+(5*(this.original_block_scale/71)), 
                                  i*this.original_block_scale-(offsetY-smoothY)+(60*(this.original_block_scale/71)));
                }
            }
            if(GV.devmode){
                ctx.fillStyle = "rgba(255,255,0,0.2)";
                ctx.fillRect(this.block_map[i][this.index_value]-this.offsetsmoothX, this.pre_vertical_position_line_block_displayed, 
                             this.pre_block_scaling,                                 this.pre_block_scaling);
            }
        }

        if(GV.devmode) //Affichage debug des collisions
        {
            ctx.font      = Tools.resolutionScaler(20)+'px arial';
            ctx.lineWidth = Tools.resolutionScaler(1);
            Tools.logText("-Count : "+this.operation_count, 40, 225, "rgb(0,255,0)", "rgb(0,100,0)");
            // ctx.lineWidth = Tools.resolutionScaler(0.5);
            ctx.font      = Tools.resolutionScaler(15)+'px arial';
            // if(this.collisions[5] == 1) //Up red
            // {
            //     ctx.fillStyle = "rgb(255,0,0)";
            //     ctx.fillRect(Tools.resolutionScaler(this.bestup[2])-this.offsetsmoothX, Tools.resolutionScaler(this.bestup[3]+320)-this.offsetsmoothY,this.pre_block_scaling,Tools.resolutionScaler(5));
            // }

            // if(this.collisions[4] == 1) //Down green
            // {
            //     ctx.fillStyle = "rgb(0,255,0)";
            //     ctx.fillRect(Tools.resolutionScaler(this.bestdown[2])-this.offsetsmoothX, Tools.resolutionScaler(this.bestdown[3]+395)-this.offsetsmoothY,this.pre_block_scaling,Tools.resolutionScaler(5));
            // }

            // if(this.collisions[6] == 1) //Left blue
            // {
            //     ctx.fillStyle = "rgb(0,0,255)";
            //     ctx.fillRect(Tools.resolutionScaler(this.bestleft[2]+593)-this.offsetsmoothX, Tools.resolutionScaler(py+this.bestleft[3])-this.offsetsmoothY,Tools.resolutionScaler(5),this.pre_block_scaling);
            // }

            // if(this.collisions[7] == 1) //Right yellow
            // {
            //     ctx.fillStyle = "rgb(255,255,0)";
            //     ctx.fillRect(Tools.resolutionScaler(this.bestright[2]+625)-this.offsetsmoothX, Tools.resolutionScaler(py+this.bestright[3])-this.offsetsmoothY,Tools.resolutionScaler(5),this.pre_block_scaling);
            // }
            Tools.logText("["+Math.round((offsetX+px)/this.original_block_scale)+" : "+Math.round((offsetY+py)/this.original_block_scale)+"]", 
                           px+smoothX+50,                                              py+smoothY+20);

            Tools.logText("[("+this.start_square_collisions_test_area[0]+", "+this.end_square_collisions_test_area[0]+") ; ("
                              +this.start_square_collisions_test_area[1]+", "+this.end_square_collisions_test_area[1]+")]", 300, 20);

            ctx.lineWidth   = Tools.resolutionScaler(2);
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.strokeRect(Tools.resolutionScaler(px+smoothX),                         Tools.resolutionScaler(py+smoothY), 
                           this.pre_block_scaling,                                     this.pre_block_scaling);

            ctx.strokeStyle = "rgb(150,150,150)";
            ctx.strokeRect(Tools.resolutionScaler(px+smoothX+Player.hit_box_offset),   Tools.resolutionScaler(py+smoothY), 
                           Tools.resolutionScaler(Player.hit_box),                     this.pre_block_scaling);
            
            // ctx.lineWidth   = Tools.resolutionScaler(1);
            // ctx.strokeStyle = "rgb(255,255,0)";
            // ctx.strokeRect(Tools.resolutionScaler(this.start_square_collisions_test_area[0]),                         Tools.resolutionScaler(Player.playerY), 
            //                Tools.resolutionScaler(this.original_block_scale+this.end_square_collisions_test_area[0]-this.start_square_collisions_test_area[0]), this.pre_block_scaling);
        }
        this.graphics_loop_log = this.GraphicsLoop.endLogTime()
    }

    requiredDisplayVariableUpdater()
    {
        // this.pre_block_scale = 24;
        this.pre_block_scaling_unround = Tools.resolutionScalerUnround(this.original_block_scale);
        this.pre_block_scaling         = Tools.resolutionScaler       (this.original_block_scale);
        this.block_map                 = [];
        
        for(let i = 0; i < this.map_limit.y+1; i++)
        {
            this.block_map.push([]);
        }
        for(let i = 0; i < this.map_limit.y+1; i++)
        {
            for(let k = 0; k < this.block_map_snap_position[i].length; k++)
            {
                this.block_map[i].push(Math.round(this.block_map_snap_position[i][k]*this.pre_block_scaling_unround));
            }
        }
    }

    fcamsmoother(pause)
    {
        this.CamSmootherLoop.startTime()
        if(pause === false)    
        {     
            if(GV.camsmootherenable) //smooth the camera
            {    
                this.previouscamsmoother   = this.camsmoother;
                this.camsmoother           = [Math.round(this.offsetX-((this.previousoffset[0][0] + this.previousoffset[1][0] + this.previousoffset[2][0] + this.previousoffset[3][0] +
                                                                        this.previousoffset[4][0] + this.previousoffset[5][0] + this.previousoffset[6][0] + this.previousoffset[7][0] )/8))
                                             ,Math.round(this.offsetY-((this.previousoffset[0][1] + this.previousoffset[1][1] + this.previousoffset[2][1] + this.previousoffset[3][1] +
                                                                        this.previousoffset[4][1] + this.previousoffset[5][1] + this.previousoffset[6][1] + this.previousoffset[7][1] +
                                                                        this.previousoffset[8][1] + this.previousoffset[9][1] + this.previousoffset[10][1]+ this.previousoffset[11][1]+
                                                                        this.previousoffset[12][1]+ this.previousoffset[13][1]+ this.previousoffset[14][1]+ this.previousoffset[15][1])/16))];
                
                this.previousoffset.unshift([this.offsetX, this.offsetY]);
                this.previousoffset.lenght = 16;
            }else{
                this.previouscamsmoother   =
                this.camsmoother           = [0, 0];
            }
        }
        this.cam_smoother_loop_log         = this.CamSmootherLoop.endLogTime()
    }

    reset()
    {
        this.map_limit = [0, 0];
        this.spawn = [0, 0];
        this.level_data = []
        this.offsetY = 0;
        this.offsetX = 0;
        this.previousoffsetX = 0;
        this.previousoffsetY = 0;
        this.offsetX_on = 0;
        this.offsetY_on = 0;
        this.cache_data = 0;
        this.collisions = [0,0,0,0,0,0,0,0];
        this.stock = [];
        this.bestup = [false,false,false,false]; //mise a 0 des variable qui enregistre la position des blocs sujets a une possible collision
        this.bestdown = [false,false,false,false,false]; // ordre Player.playerX,py;ox,oy
        this.bestleft = [false,false,false,false];
        this.bestright = [false,false,false,false];
        this.previousoffset = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
        this.camsmoother = [0, 0];
        this.previouscamsmoother = [0,0];
        this.level_data_textures = [];
        this.data_temp = [];
    }
}

export{Map_Data}

