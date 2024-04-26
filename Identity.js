let clickedSquareId = null;
let move = "White";
let WhiteKing="e1"; let BlackKing="e8";
let WK=0; let BK=0; let Ra1=0; let Rh1=0; let Ra8=0; let Rh8=0;
let LastPiece=null; let LastSquare = null; let LastFrom = null;
let all_squares=[]
each_sq=null;
let game="on";
for(let i=1;i<=8;i++)
{
    for(let j=97;j<=104;j++)
    {
        each_sq=String.fromCharCode(j)+i;
        all_squares.push(each_sq);
    }
}
function cpl(col)
{
    if (col==="White")
    return "Black";
    else if(col==="Black")
    return "White"
}
function deleteImage(square_id) {
    const sq = document.getElementById(square_id);
    const el = sq.querySelector('img');
    let image_id = el.src;
    el.src=null;
    return image_id; 
}

function modifyImage(square_id, image_id) {
    const sq = document.getElementById(square_id);
    let el = sq.querySelector('img');
    if (!el) {
        el = document.createElement('img');
        sq.appendChild(el);
    }
    el.src = image_id;
}
function Check(mov)
{
    let kid = mov==="White"?WhiteKing:BlackKing;
    let ins = "a1";
    for(let i=0;i<all_squares.length;i++)
    {        
            ins=all_squares[i];
            const square = document.getElementById(ins);
            const image = square.querySelector("img");
            if(!image)
            continue;
            const imageName = image.src;
            if(imageName.includes(cpl(mov)) && ValidMove(kid,ins,cpl(mov)))
            return true;
        }
    return false;
}
function CheckChecker(id, click, mov)
{
    if(click===null)
    return false;
    const old = deleteImage(click);
    const latest = deleteImage(id);
    if(old.includes("King"))
    {
        if(mov==="White")
        WhiteKing=id;
        else if(mov==="Black")
        BlackKing=id;
    }
    modifyImage(id, old);
    let ans = Check(mov);
    modifyImage(id, latest);
    modifyImage(click,old);
    if(old.includes("King"))
    {
        if(mov==="White")
        WhiteKing=click;
        else if(mov==="Black")
        BlackKing=click;
    }
    if(ans===true)
    clickedSquareId=null;
    return ans;
}
function ImageCheck(squareId) {
    const square = document.getElementById(squareId);    
    const image = square.querySelector("img");
    if (!image) {
        return false;
    }
    const imageName = image.src;
    if (imageName.includes("White") || imageName.includes("Black")) {
        return true; 
    } else {
        return false; 
    }
}
function ReturnImage(squareId)
{
    const square = document.getElementById(squareId);    
    const image = square.querySelector("img");
    return(image.src);
}
function ValidOptions(mov)
{
    if(game==="over")
    return false;
    if(clickedSquareId)
    return true;
    for(let i=0;i<all_squares.length;i++)
    {
        let initial = all_squares[i];
        let isq = document.getElementById(initial);
        let image = isq.querySelector("img");
        let imageName = image.src;
        if(!imageName.includes(mov))
        continue;
        for(let j=0;j<all_squares.length;j++)
        {
            let final = all_squares[j];
            if(WrongClick(final,initial,mov))
            continue;
            if(ValidMove(final,initial,mov) && !CheckChecker(final,initial,mov))
            return true;
        }
    }
    game="over";
    const turner = document.getElementById("turn");    
                console.log("Mate");
                if (Check(move)) {
                    if (move === "White") {
                    modifyImage(WhiteKing,"WhiteMate.png");                    
                    turner.innerHTML="Black Won by Checkmate";
                } else if (move === "Black") {
                    modifyImage(BlackKing,"BlackMate.png");
                    turner.innerHTML="White Won by Checkmate";
                    
                }
                } else {
                    if (move === "White") {
                    modifyImage(WhiteKing,"WhiteStale.png");
                    } else if (move === "Black") {
                    modifyImage(BlackKing,"BlackStale.png");
                    }
                turner.innerHTML="Match drawn by Stalemate";
                }
    return false;
}
function NoStraightObstruction(id, click)
{
    const f1=click.charCodeAt(0);
    const f2=id.charCodeAt(0);
    const r1=click.charAt(1);
    const r2=id.charAt(1);
    if(r1===r2)
    {
        if(Math.abs(f1-f2)===1)
        return true;
        let k=0;
        for(let i=Math.min(f1,f2)+1;i<Math.max(f1,f2);i++)
        {
            let sq = String.fromCharCode(i) + r1;
            if(ImageCheck(sq)) {
                k=1;
                break;
            }   
        }
        if(k===0)
        return true;
        else
        return false;
    }
    else if(f1===f2)
    {
        if(Math.abs(r1-r2)===1)
        return true;
        let k=0;
        for(let i=Math.min(r1,r2)+1;i<Math.max(r1,r2);i++)
        {
            let sq = String.fromCharCode(f1) + i;
            if(ImageCheck(sq)) {
                k=1;
                break;
            }            
        }
        if(k===0)
        return true;
        else
        return false;
    }
    else
    return false;
}
function NoDiagonalObstruction(id, click)
{
    const f1=click.charCodeAt(0);
    const f2=id.charCodeAt(0);
    const r1=Number(click.charAt(1));
    const r2=Number(id.charAt(1));
    if(Math.abs(f1-f2)!=Math.abs(r1-r2))
    return false;
    else if(Math.abs(r1-r2)===1)
    return true;
    else{
        let fc = f1 < f2 ? 1 : -1;
        let rc = r1 < r2 ? 1 : -1;
        let i=f1+fc;
        let j=r1+rc;
        let k=0;
        while(i!=f2 && j!=r2)
        {   
            let sq = String.fromCharCode(i) + j;
            if(ImageCheck(sq)) {
                k=1;
                break;
            }   
            i=i+fc;
            j=j+rc;
        }
        if(k===0)
        return true;
        else return false;
    }
}
function ValidColor(square_id, click, mov)
{
    const sq = document.getElementById(square_id);
    const im = sq.querySelector('img');
    const imgn = im.src;
    if(click==null && imgn.includes(mov))
    return true;
    else if(click)
    return true;
    else
    return false;
}
function WrongClick(square_id, click, mov)
{
    const sq = document.getElementById(square_id);
    const im = sq.querySelector('img');
    const imgn = im.src;
    if(click && imgn.includes(mov))
    return true;
    else
    return false;
}
function doCastle(id, click, mov)
{
    if(click==="e1" && id==="g1" && mov==="White" && !ImageCheck("g1"))
    {
        let img_id = deleteImage("h1");
        modifyImage("f1",img_id);
        WhiteKing="g1";
        WK=1;
        Rh1=1;
    }
    else if(click==="e1" && id==="c1" && mov==="White" && !ImageCheck("c1"))
    {
        let img_id = deleteImage("a1");
        modifyImage("d1",img_id);
        WhiteKing="c1";
        WK=1;
        Ra1=1;
    }
    else if(click==="e8" && id==="g8" && mov==="Black" && !ImageCheck("g8"))
    {
        let img_id = deleteImage("h8");
        modifyImage("f8",img_id);
        BlackKing="g8";
        BK=1;
        Rh8=1;
    }
    else if(click==="e8" && id==="c8" && mov==="Black" && !ImageCheck("c8"))
    {
        let img_id = deleteImage("a8");
        modifyImage("d8",img_id);
        BlackKing="c8";
        BK=1;
        Ra8=1;
    }
}
function Castle(id, click, mov)
{
    if(WrongClick(id,click,mov))
    return false;
    if(mov==="White" && !Check(mov) && WK===0)
    {
        if(WhiteKing==="e1")
        {
            if(click==="e1" && id==="g1" && Rh1===0 && NoStraightObstruction("e1","h1") 
            && !CheckChecker("f1","e1",mov) && !CheckChecker("g1","e1",mov))
            return true;
            else if(click==="e1" && id==="c1" && Ra1===0 && NoStraightObstruction("e1","a1")
            && !CheckChecker("d1","e1",mov) && !CheckChecker("c1","e1",mov))
            return true;
        }
        else return false;
    }
    else if(mov==="Black" && BK===0 &&!Check(mov))
    {
        if(BlackKing==="e8")
        {
            if(click==="e8" && id==="g8" && Rh8===0 && NoStraightObstruction("e8","h8")
            && !CheckChecker("f8","e8",mov) && !CheckChecker("g8","e8",mov))
            return true;
            else if(click==="e8" && id==="c8" && Ra8===0 && NoStraightObstruction("e8","a8")
            && !CheckChecker("d8","e8",mov) && !CheckChecker("c8","e8",mov))
            return true;
        }
        else return false;
    }
    else return false;
}
function KnightValid(id, click)
{
    let rdif = Math.abs(id.charCodeAt(0) - click.charCodeAt(0));
    let cdif = Math.abs(Number(id.charAt(1)) - Number(click.charAt(1)));
    if((rdif===2 && cdif===1)||(rdif===1 && cdif===2))
    return true;
    else
    return false; 
}
function BishopValid(id, click)
{
    let rdif = Math.abs(id.charCodeAt(0) - click.charCodeAt(0));
    let cdif = Math.abs(Number(id.charAt(1)) - Number(click.charAt(1)));
    if((rdif===cdif) && NoDiagonalObstruction(click,id))
    return true;
    else
    return false;
}
function RookCount(click)
{
    if(click==="a1")
    Ra1=1;
    else if(click==="h1")
    Rh1=1;
    else if(click==="a8")
    Ra8=1;
    else if(click==="h8")
    Rh8=1;
}
function RookValid(id, click)
{
    if(((id.charAt(0)===click.charAt(0))||(id.charAt(1)===click.charAt(1)))&& NoStraightObstruction(id,click))
    return true;       
    else
    return false;
}
function QueenValid(id, click)
{
    if(RookValid(id, click)||BishopValid(id, click))
    return true;
    else
    return false;
}
function KingCount(id,mov)
{
    if(mov==="White")
    {
        WhiteKing=id;
        WK=1;
    }
    else if(mov==="Black")
    {
        BlackKing=id;
        BK=1;
    }  
}
function KingValid(id, click, mov)
{    
    if(WrongClick(id,click,mov))
    return false;
    let rdif = Math.abs(id.charCodeAt(0) - click.charCodeAt(0));
    let cdif = Math.abs(Number(id.charAt(1)) - Number(click.charAt(1)));
    if(rdif===2 && cdif===0)
    return Castle(id, click, mov);
    else if(rdif<=1 && cdif<=1)
    return true;     
    else
    return false;
}
function Promote(mov)
{
    let piece = null;
    const promotion = prompt("Promote to a: \n'Q' for Queen\n'R' for Rook\n'N' for Knight\n'B' for Bishop","Q");
    switch(promotion.toUpperCase())
    {
        case 'Q': piece=mov+"Queen.png"; break;
        case 'R': piece=mov+"Rook.png"; break;
        case 'N': piece=mov+"Knight.png"; break;
        case 'B': piece=mov+"Bishop.png";break;
        default: piece=mov+"Queen.png";break;
    }
    return(piece);
}
function CheckPromotion(id,click,mov)
{
    let init = 7;
    let fin = 8;
    if(mov==="Black")
    {
        init=9-init;
        fin=9-fin;
    }
    if((Number(click.charAt(1))===init) && (Number(id.charAt(1))===fin))
    return true;
    else
    return false;
}
function enPassant(id, click)
{
    let sreq = id[0]+click[1];
    let dim = deleteImage(sreq);
}
function PawnValid(id, click, mov)
{
    let rdif = Math.abs(id.charCodeAt(0) - click.charCodeAt(0));
    let cdif = Number(click.charAt(1)) - Number(id.charAt(1));
    let double=7; let rinit=null; let rfin = null; let rate=-1;
    if (mov==="White")
    {
        cdif = -1*cdif;
        double=2;
        rate=1;
    }
    
    if(rdif===0)
    {
        if((((Number(click.charAt(1))===double && (cdif===1 || cdif===2))||cdif===1) && NoStraightObstruction(id,click)) && !ImageCheck(id))
        return true;
    }
    else if(rdif===1)
    {
        if(cdif===1)
        {
            if(ImageCheck(id))
            return true;
            else if(Number(click.charAt(1))===(double+3*rate))
            {
                rinit=id[0]+(Number(id.charAt(1))+rate);
                rfin=id[0]+(Number(id.charAt(1))-rate);
                if((rinit===LastFrom) && (rfin===LastSquare) && (LastPiece.includes(cpl(mov)+"Pawn")))
                return true;                
            }
        } 
        
    }
    else 
    return false;
}
function ValidMove(square_id, click,mov)
{
    if(click===null)
    return true;
    else if(WrongClick(square_id, click,mov))
    return true;
    const sq = document.getElementById(square_id);
    const cq = document.getElementById(click);
    const im = cq.querySelector('img');
    const imgn = im.src;
    if(imgn.includes("Knight"))
    return(KnightValid(square_id, click));
    else if(imgn.includes("Bishop"))
    return(BishopValid(square_id, click));
    else if(imgn.includes("Rook"))
    return(RookValid(square_id, click));
    else if(imgn.includes("Queen"))
    return(QueenValid(square_id, click));
    else if(imgn.includes("King"))
    return(KingValid(square_id, click, mov));
    else if(imgn.includes("Pawn"))
    return(PawnValid(square_id, click, mov));
    else
    return true;    
}
const File_Names = ["a", "b", "c", "d", "e", "f", "g", "h"];

for (const fileName of File_Names) {
    const squares = document.querySelector(`.${fileName}`).children;
    
    for (let i = 0; i < squares.length - 1; i++) {
        squares[i].setAttribute("id", `${fileName}${8 - i}`);
        const square = document.getElementById(`${fileName}${8 - i}`);
        
        square.addEventListener("click", () => {                     
            if ((ImageCheck(square.id) || clickedSquareId)&&(ValidColor(square.id,clickedSquareId,move))
            && ValidMove(square.id,clickedSquareId,move)&&!CheckChecker(square.id,clickedSquareId,move)
            && ValidOptions(move)) {
                console.log(ValidOptions(move));
                if (clickedSquareId && !WrongClick(square.id,clickedSquareId,move) ) { 
                    let im = ReturnImage(clickedSquareId);
                    if(im.includes("King"))
                    {
                        if(Castle(square.id,clickedSquareId,move))
                        doCastle(square.id,clickedSquareId,move);
                        else
                        KingCount(square.id,move);
                    }
                    if(im.includes("Rook"))
                    RookCount(clickedSquareId);
                    let imageId = deleteImage(clickedSquareId); 
                    if(im.includes("Pawn"))
                    {
                        if(CheckPromotion(square.id,clickedSquareId,move))
                        imageId=Promote(move);
                        else if((clickedSquareId[0]!=square.id[0]) && !ImageCheck(square.id))
                        enPassant(square.id,clickedSquareId);
                    }
                    modifyImage(square.id, imageId); 
                    LastPiece=ReturnImage(square.id);
                    LastSquare=square.id;
                    LastFrom=clickedSquareId;
                    clickedSquareId = null; 
                    move=cpl(move);
                    console.log(ValidOptions(move));
                    if(!ValidOptions(move))
                    game="over";
                    console.log(game);
                } else {
                    clickedSquareId = square.id;
                }
                const turner = document.getElementById("turn");
                console.log(game);
                if(game==="over")
                {turner.innerHTML = "<h1>" + cpl(move) + " won by Checkmate</h1>";}
                else{
                turner.innerHTML = "<h1>" + move + " to move</h1>";}
                console.log(move);
                console.log(clickedSquareId);
                
                square.classList.add("clicked");
                setTimeout(() => {
                    square.classList.remove("clicked");
                }, 1000);
            }
        });
    }
}

