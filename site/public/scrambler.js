//////////////////////////////////////////////////////////
// Scramblers adapted from qqtimer by Michael Gottlieb, //
//    based on work by Shuang Chen and Lucas Garron     //
//                See www.qqtimer.net                   //
//////////////////////////////////////////////////////////

// import * as image from "./image.js";
// importScripts("./image.js");

// Performance is better if we only init the random-state scramblers once each
var initonce333 = 1;
var initoncesq1 = 1;

var cubesuff = ["","2","'"];

function getScramble(shortname) {
    if (shortname === "222") {
        return get2x2optscramble(9);
        // const scram = get2x2optscramble(9);
        // execFunc($("#scrimg"));
        // console.log(genImage(['222', scram]));
        // return scram;
    } else if (shortname === "333" || shortname === "333oh" || shortname === "333bf") {
        if (initonce333 === 1) {
            scramblers['333'].initialize(null, Math);
            initonce333 = 0;
        }
        return scramblers["333"].getRandomScramble();
    } else if(shortname === "sq1") {
        if (initoncesq1 === 1) {
            scramblers['sq1'].initialize(null, Math);
            initoncesq1=0;
        }
        return scramblers["sq1"].getRandomScramble()
                                .scramble_string
                                // to prevent line breaks in the middle of a pair
                                .replace("/\, /g", ",&nbsp");
    } else if (shortname === "444fast") {
        return megascramble([["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]], cubesuff, 40);
    } else if (shortname === "555") {
        return megascramble([["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]], cubesuff, 60);
    } else if (shortname === "666") {
        return megascramble([["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]], cubesuff, 80);
    } else if (shortname === "777") {
        return megascramble([["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]], cubesuff, 100);
    } else if (shortname === "pyram") {
        return getpyraoptscramble(8);
    } else if (shortname === "minx") {
        // 70 moves in 7 rows of 10 each
        return pochscramble(10, 7);
    } else if (shortname === "clock") {
        return getClockScramble();
    } else if (shortname === "skewb") {
        return getskewboptscramble(8);
    }
}

/* Function by Kas Thomas, http://www.planetpdf.com/developer/article.asp?ContentID=testing_for_object_types_in_ja */
function isArray(obj){
 if(typeof obj=='object'){
  var test = obj.constructor.toString().match(/array/i); 
  return (test != null);
  }
 return false;
}

// Takes a random element of the array x.
function rndEl(x){return x[Math.floor(Math.random()*x.length)];}

// generator for all random-move puzzles
function megascramble(turns, suffixes, len){
 var donemoves=[];
 var lastaxis;
 var i,j,k;
  var s="";
  lastaxis=-1;
  for(j=0;j<len;j++){
   var done=0;
   do{
    var first=Math.floor(Math.random()*turns.length);
    var second=Math.floor(Math.random()*turns[first].length);
    if (first!=lastaxis) {
     for(k=0;k<turns[first].length;k++){donemoves[k]=0;}
     lastaxis=first;
    }
    if (donemoves[second]==0) {
     donemoves[second]=1;
     if(isArray(turns[first][second])){
      s+=rndEl(turns[first][second])+rndEl(suffixes)+" ";
     }else{
      s+=turns[first][second]+rndEl(suffixes)+" ";
     }
     done=1;
    }
   }while(done==0);
  }
  return s;
 }

// the argument is minimum number of moves in the scramble
function get2x2optscramble(mn) {
 var e=[15,16,16,21,21,15,13,9,9,17,17,13,14,20,20,4,4,14,12,5,5,8,8,12,3,23,23,18,18,3,1,19,19,11,11,1,2,6,6,22,22,2,0,10,10,7,7,0],d=[[],[],[],[],[],[]],v=[[0,2,3,1,23,19,10,6,22,18,11,7],[4,6,7,5,12,20,2,10,14,22,0,8],[8,10,11,9,12,7,1,17,13,5,0,19],[12,13,15,14,8,17,21,4,9,16,20,5],[16,17,19,18,15,9,1,23,13,11,3,21],[20,21,23,22,14,16,3,6,15,18,2,4]],r=[],a=[],b=[],c=[],f=[],s=[];function t(){s=[1,1,1,1,2,2,2,2,5,5,5,5,4,4,4,4,3,3,3,3,0,0,0,0]}t();function mx(){t();for(var i=0;i<500;i++)dm(Math.floor(Math.random()*3+3)+16*Math.floor(Math.random()*3))}function cj(){var i,j;for(i=0;i<6;i++)for(j=0;j<6;j++)d[i][j]=0;for(i=0;i<48;i+=2)if(s[e[i]]<=5&&s[e[i+1]]<=5)d[s[e[i]]][s[e[i+1]]]++}function dm(m){var j=1+(m>>4),k=m&15,i;while(j){for(i=0;i<v[k].length;i+=4)y(s,v[k][i],v[k][i+3],v[k][i+2],v[k][i+1]);j--}}function sv(){cj();var h=[],w=[],i=0,j,k,m;for(j=0;j<7;j++){m=0;for(k=i;k<i+6;k+=2){if(s[e[k]]==s[e[42]])m+=4;if(s[e[k]]==s[e[44]])m+=1;if(s[e[k]]==s[e[46]])m+=2}h[j]=m;if(s[e[i]]==s[e[42]]||s[e[i]]==5-s[e[42]])w[j]=0;else if(s[e[i+2]]==s[e[42]]||s[e[i+2]]==5-s[e[42]])w[j]=1;else w[j]=2;i+=6}m=0;for(i=0;i<7;i++){j=0;for(k=0;k<7;k++){if(h[k]==i)break;if(h[k]>i)j++}m=m*(7-i)+j}j=0;for(i=5;i>=0;i--)j=j*3+w[i]-3*Math.floor(w[i]/3);if(m!=0||j!=0){r.length=0;for(k=mn;k<99;k++)if(se(0,m,j,k,-1))break;j="";for(m=0;m<r.length;m++)j="URF".charAt(r[m]/10)+"\'2 ".charAt(r[m]%10)+" "+j;return j}}function se(i,j,k,l,m){if(l!=0){if(a[j]>l||b[k]>l)return false;var o,p,q,n;for(n=0;n<3;n++)if(n!=m){o=j;p=k;for(q=0;q<3;q++){o=c[o][n];p=f[p][n];r[i]=10*n+q;if(se(i+1,o,p,l-1,n))return true}}}else if(j==0&&k==0)return true;return false}function z(){var i,j,k,m,n;for(i=0;i<5040;i++){a[i]=-1;c[i]=[];for(j=0;j<3;j++)c[i][j]=g(i,j)}a[0]=0;for(i=0;i<=6;i++)for(j=0;j<5040;j++)if(a[j]==i)for(k=0;k<3;k++){m=j;for(n=0;n<3;n++){var m=c[m][k];if(a[m]==-1)a[m]=i+1}}for(i=0;i<729;i++){b[i]=-1;f[i]=[];for(j=0;j<3;j++)f[i][j]=w(i,j)}b[0]=0;for(i=0;i<=5;i++)for(j=0;j<729;j++)if(b[j]==i)for(k=0;k<3;k++){m=j;for(n=0;n<3;n++){var m=f[m][k];if(b[m]==-1)b[m]=i+1}}}function g(i,j){var k,m,n,o=i,h=[];for(k=1;k<=7;k++){m=o%k;o=(o-m)/k;for(n=k-1;n>=m;n--)h[n+1]=h[n];h[m]=7-k}if(j==0)y(h,0,1,3,2);else if(j==1)y(h,0,4,5,1);else if(j==2)y(h,0,2,6,4);o=0;for(k=0;k<7;k++){m=0;for(n=0;n<7;n++){if(h[n]==k)break;if(h[n]>k)m++}o=o*(7-k)+m}return o}function w(i,j){var k,m,n,o=0,p=i,h=[];for(k=0;k<=5;k++){n=Math.floor(p/3);m=p-3*n;p=n;h[k]=m;o-=m;if(o<0)o+=3}h[6]=o;if(j==0)y(h,0,1,3,2);else if(j==1){y(h,0,4,5,1);h[0]+=2;h[1]++;h[5]+=2;h[4]++}else if(j==2){y(h,0,2,6,4);h[2]+=2;h[0]++;h[4]+=2;h[6]++}p=0;for(k=5;k>=0;k--)p=p*3+(h[k]%3);return p}function y(i,j,k,m,n){var o=i[j];i[j]=i[k];i[k]=i[m];i[m]=i[n];i[n]=o}z();
  mx();
  return sv();
}

function getpyraoptscramble(mn) {
 var j=1,b=[],g=[],f=[],d=[],e=[],k=[],h=[],i=[];function u(){var c,p,q,l,m;for(p=0;p<720;p++){g[p]=-1;d[p]=[];for(m=0;m<4;m++)d[p][m]=w(p,m)}g[0]=0;for(l=0;l<=6;l++)for(p=0;p<720;p++)if(g[p]==l)for(m=0;m<4;m++){q=p;for(c=0;c<2;c++){q=d[q][m];if(g[q]==-1)g[q]=l+1}}for(p=0;p<2592;p++){f[p]=-1;e[p]=[];for(m=0;m<4;m++)e[p][m]=x(p,m)}f[0]=0;for(l=0;l<=5;l++)for(p=0;p<2592;p++)if(f[p]==l)for(m=0;m<4;m++){q=p;for(c=0;c<2;c++){q=e[q][m];if(f[q]==-1)f[q]=l+1}}for(c=0;c<j;c++){k=[];var t=0,s=0;q=0;h=[0,1,2,3,4,5];for(m=0;m<4;m++){p=m+n(6-m);l=h[m];h[m]=h[p];h[p]=l;if(m!=p)s++}if(s%2==1){l=h[4];h[4]=h[5];h[5]=l}s=0;i=[];for(m=0;m<5;m++){i[m]=n(2);s+=i[m]}i[5]=s%2;for(m=6;m<10;m++){i[m]=n(3)}for(m=0;m<6;m++){l=0;for(p=0;p<6;p++){if(h[p]==m)break;if(h[p]>m)l++}q=q*(6-m)+l}for(m=9;m>=6;m--)t=t*3+i[m];for(m=4;m>=0;m--)t=t*2+i[m];if(q!=0||t!=0)for(m=mn;m<99;m++)if(v(q,t,m,-1))break;b[c]="";for(p=0;p<k.length;p++)b[c]+=["U","L","R","B"][k[p]&7]+["","'"][(k[p]&8)/8]+" ";var a=["l","r","b","u"];for(p=0;p<4;p++){q=n(3);if(q<2)b[c]+=a[p]+["","'"][q]+" "}}}function v(q,t,l,c){if(l==0){if(q==0&&t==0)return true}else{if(g[q]>l||f[t]>l)return false;var p,s,a,m;for(m=0;m<4;m++)if(m!=c){p=q;s=t;for(a=0;a<2;a++){p=d[p][m];s=e[s][m];k[k.length]=m+8*a;if(v(p,s,l-1,m))return true;k.length--}}}return false}function w(p,m){var a,l,c,s=[],q=p;for(a=1;a<=6;a++){c=Math.floor(q/a);l=q-a*c;q=c;for(c=a-1;c>=l;c--)s[c+1]=s[c];s[l]=6-a}if(m==0)y(s,0,3,1);if(m==1)y(s,1,5,2);if(m==2)y(s,0,2,4);if(m==3)y(s,3,4,5);q=0;for(a=0;a<6;a++){l=0;for(c=0;c<6;c++){if(s[c]==a)break;if(s[c]>a)l++}q=q*(6-a)+l}return q}function x(p,m){var a,l,c,t=0,s=[],q=p;for(a=0;a<=4;a++){s[a]=q&1;q>>=1;t^=s[a]}s[5]=t;for(a=6;a<=9;a++){c=Math.floor(q/3);l=q-3*c;q=c;s[a]=l}if(m==0){s[6]++;if(s[6]==3)s[6]=0;y(s,0,3,1);s[1]^=1;s[3]^=1}if(m==1){s[7]++;if(s[7]==3)s[7]=0;y(s,1,5,2);s[2]^=1;s[5]^=1}if(m==2){s[8]++;if(s[8]==3)s[8]=0;y(s,0,2,4);s[0]^=1;s[2]^=1}if(m==3){s[9]++;if(s[9]==3)s[9]=0;y(s,3,4,5);s[3]^=1;s[4]^=1}q=0;for(a=9;a>=6;a--)q=q*3+s[a];for(a=4;a>=0;a--)q=q*2+s[a];return q}function y(p,a,c,t){var s=p[a];p[a]=p[c];p[c]=p[t];p[t]=s}function n(c){return Math.floor(Math.random()*c)}
 u();
 return b[0];
}

function getskewboptscramble(e){
 function t(e){var t=arguments.length-1,n=e[arguments[t]];for(var r=t;r>1;r--){e[arguments[r]]=e[arguments[r-1]]}e[arguments[1]]=n}function n(e,t){return e[t>>3]>>((t&7)<<2)&15}function r(e,t,n,r){for(var i=0;i<r;i++){e[i]=[];for(var s=0;s<t;s++){e[i][s]=n(s,i)}}}function i(e,t,r,i,s,o,u){var a=Array.isArray(s);for(var f=0,l=r+7>>>3;f<l;f++){e[f]=-1}e[t>>3]^=15<<((t&7)<<2);for(var c=0;c<=i;c++){var h=c+1^15;for(var p=0;p<r;p++){if(n(e,p)==c){for(var d=0;d<o;d++){var v=p;for(var m=0;m<u;m++){v=a?s[d][v]:s(v,d);if(n(e,v)==15){e[v>>3]^=h<<((v&7)<<2)}}}}}}}function s(e,t,r,i,o){if(0==r)return 0==e&&0==t;if(n(a,e)>r||n(f,t)>r)return!1;for(var u=0;4>u;u++)if(u!=i)for(var h=e,p=t,d=0;2>d;d++)if(h=l[u][h],p=c[u][p],s(h,p,r-1,u,o))return o.push(u*2+(1-d)),!0;return!1}function o(e,n){var r=e%12;e=~~(e/12);for(var i=[],s=5517840,o=0,u=0;5>u;u++){var a=h[5-u],f=~~(e/a),e=e-f*a,o=o^f,f=f<<2;i[u]=s>>f&15;a=(1<<f)-1;s=(s&a)+(s>>4&~a)}0==(o&1)?i[5]=s:(i[5]=i[4],i[4]=s);0==n&&t(i,0,3,1);2==n&&t(i,1,5,2);1==n&&t(i,0,2,4);3==n&&t(i,3,4,5);e=0;s=5517840;for(u=0;4>u;u++)f=i[u]<<2,e*=6-u,e+=s>>f&15,s-=1118480<<f;return e*12+p[r][n]}function u(e,t){var n=[];var r=[];for(var i=0;i<4;i++){n[i]=e%3;e=~~(e/3)}for(var i=0;i<3;i++){r[i]=e%3;e=~~(e/3)}r[3]=(6-r[0]-r[1]-r[2])%3;n[t]=(n[t]+1)%3;var s;if(t==0){var s=r[0];r[0]=r[2]+2;r[2]=r[1]+2;r[1]=s+2}else if(t==1){var s=r[0];r[0]=r[1]+2;r[1]=r[3]+2;r[3]=s+2}else if(t==2){var s=r[0];r[0]=r[3]+2;r[3]=r[2]+2;r[2]=s+2}else if(t==3){var s=r[1];r[1]=r[2]+2;r[2]=r[3]+2;r[3]=s+2}for(var i=2;i>=0;i--){e=e*3+r[i]%3}for(var i=3;i>=0;i--){e=e*3+n[i]}return e}var a=[],f=[],l=[],c=[];var h=[1,1,1,3,12,60,360];var p=[[6,5,10,1],[9,7,4,2],[3,11,8,0],[10,1,6,5],[0,8,11,3],[7,9,2,4],[4,2,9,7],[11,3,0,8],[1,10,5,6],[8,0,3,11],[2,4,7,9],[5,6,1,10]];var d=[0,1,2,0,2,1,1,2,0,2,1,0];var v,m,y=[];r(l,4320,o,4);i(a,0,4320,7,l,4,2);r(c,2187,u,4);i(f,0,2187,6,c,4,2);do{v=0|Math.random()*4320;m=0|Math.random()*2187}while(v==0&&m==0||d[v%12]!=(m+~~(m/3)+~~(m/9)+~~(m/27))%3);for(;99>e&&!s(v,m,e,-1,y);e++){}var b=[];var w=["L","R","B","U"];for(var u=0;u<y.length;u++){var E=y[u]>>1;var S=y[u]&1;if(E==2){for(var l=0;l<=S;l++){var x=w[0];w[0]=w[1];w[1]=w[3];w[3]=x}}b.push(w[E]+(S==1?"'":""))}
 return b.join(" ")
}

function pochscramble(x,y) {
 var i,j,n;
 var scram = "";
  for(i=0;i<y;i++){
   if (i !== 0) {scram+="\n";}
   for(j=0;j<x;j++){
    scram+=(j%2==0?"R":"D")+rndEl(["++","--"])+" ";
   }
   scram+="U"+rndEl(["'"," "]);
  }
  return scram;
 }

function getClockScramble() { 
   var scram = "";
   var clock_rotations=["0+", "1+", "2+", "3+", "4+", "5+", "6+", "5-", "4-", "3-", "2-", "1-"];
   var pins=["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL", "U", "R", "D", "L", "ALL"];
   var final_pins=["UR", "DR", "DL", "UL"];
   for(var i=0;i<14;i++){
    scram+=pins[i]+rndEl(clock_rotations)+" ";
    if(i==8) scram+="y2 ";
   }
   for(var i=0;i<4;i++){
    scram+=rndEl([final_pins[i]+" ", ""])
   }
   scram+="";
   return scram;
  }
