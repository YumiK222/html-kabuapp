//Form要素を取得する
var form = document.forms.myform;
//CSVを2次元配列化したオブジェクト
var res= [];
//一時停止フラグ
var pause_flg = 0;
//カウント
var count = 0;
var count_arr = 0;
var table_row = 1;
//一時停止時のカウント退避
var taihi_count = 0;
//インターバルID
var interval;
//時刻表示
function CurrentTime() {
    let Time = new Date(); //  現在日時を得る
    let nowHour = Time.getHours(); // 時間を抜き出す
    let nowMin  = Time.getMinutes(); // 分数を抜き出す
    let nowSec  = Time.getSeconds(); // 秒数を抜き出す
    let nowtime =  nowHour + ":" + nowMin + ":" + nowSec;
    return nowtime;
}
var now;
    //ファイルが読み込まれたときの処理
var fileinput = document.getElementById("myfile");

fileinput.addEventListener('change',function(e){
    //読み込んだファイル情報を取得
    var result = e.target.files[0];
    //FileReaderのインスタンスを作成する
    var reader =new FileReader();
    //読み込んだファイルの中身を取得する
    reader.readAsText(result,"sjis");
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener('load',function(){
        res = CsvtoArray(reader.result);

        //10秒ごとに新規株探画面を開く
        //CSVの2行目からスタート
        count = 1;

        // 1件目は10秒待たずに表示する
        windowOpen(res, count);
        count++;

        // 2件目以降は10秒インターバルで処理実行
        interval = setInterval(function(){
            slideshow(res, count, interval);
            count++;
        },10000);
    })
})
//CSVファイルを2次元配列化する関数
function CsvtoArray(result){
    //改行で区切って、1行づつを配列arrに格納
    var arr = result.split('\n');
    //行数-2が銘柄数。銘柄数itemを差し替える。
    count_arr = arr.length - 2;
    var meigarasu = document.getElementById("meigarasu");
    meigarasu.textContent = count_arr;
    //銘柄数テーブルを表示させる。
    var meigarasu = document.querySelector("table");
    meigarasu.style.color ="#000000";
    //配列arrをさらにカンマで区切って2次元配列にする
    var res = [];
    //1行目のタイトル行は処理スキップし、2行目以降をループする
    for(var i = 1; i < arr.length; i++){
        //空白行が出てきた時点で終了
        if(arr[i] == '') break;
        //","ごとに配列化
        res[i] = arr[i].split(',');
        //2個目の銘柄コードを取得
        //銘柄コードのダブルコーテを削除
        res[i][1] = parseFloat(res[i][1].replace('"',''));
        res[i][5] = res[i][5].replace(/"/g,'');
    }
    return res;
}
// 新規ウィンドウをオープンするfunction
function windowOpen(res, count) {
    var meigara_code_link = 'https://kabutan.jp/stock/chart?code=' + res[count][1];
    window.open(meigara_code_link, "slideshow", 'width=1000,height=1000');
    now = CurrentTime();
    console.log(now, meigara_code_link, interval, count);
}
//スライドショー関数
function slideshow(res, count, interval) {
    //pause_flgが1の場合はスライドショーを一時中断する。
    if (pause_flg === 1){
        clearInterval(interval);
    }
    else{
        //pause_flgが0の場合のみ、次銘柄を表示する。
        windowOpen(res, count);
    }
    if(count == (count_arr)) {
        clearInterval(interval);
    }
};
//一時停止ボタンを押したら、スライドショーを一時停止して、テキスト入力可能なテーブルを追加表示する
//onclick属性から呼び出すので、0Lvに関数を記載
function pause_slideshow(){
    now = CurrentTime();
    console.log(now, '停止', interval);
    clearInterval(interval);
    //定数intervalは、関数内で定義されているのでスコープが違うため使用できない
    //一時停止フラグを1に変更する。
    pause_flg = 1;
    //現在のカウントを退避する
    taihi_count = count;
    //銘柄コードと銘柄名を引き渡す
    var meigara_code = res[count-1][1];
    var meigara_name = res[count-1][5];
    //テーブル追加関数を実行
    add_table(meigara_code, meigara_name);
    //pauseボタンを濃いグレーにする。
    var pause_button = document.getElementById('pause_button');
    var color = window.getComputedStyle(pause_button, '').backgroundColor;
    //console.log(color);
    pause_button.style.backgroundColor = "grey";
    //restartボタンを薄いグレーにする。
    var restart_button = document.getElementById('restart_button');
    restart_button.style.backgroundColor =" #f0f0f0";
}
function add_table(meigara_code, meigara_name){
    //コメント用テーブルをvisibility:visibleに変える。
    var comment_table = document.getElementById("comment_table");
    comment_table.style.visibility ="visible";
    var newrow = comment_table.insertRow(-1);
    //銘柄コード
    var td_meigaracode = newrow.insertCell(-1);
    var meigara_link = document.createElement("a");
    meigara_link.textContent = meigara_code;
    var link = "https://kabutan.jp/stock/?code=" + meigara_code;
    meigara_link.setAttribute('href', link);
    meigara_link.setAttribute('target', '_blank');
    td_meigaracode.appendChild(meigara_link);
    //銘柄名
    var td_meigaraname = newrow.insertCell(-1);
    td_meigaraname.textContent = meigara_name;
    //コメント
    var td_comment = newrow.insertCell(-1);
    var comment_text = document.createElement("textarea");
    comment_text.setAttribute('id', 'comment_text'+ table_row);
    td_comment.appendChild(comment_text);
   //pタグ
 //   var ptag = document.createElement("p");
 //   ptag.setAttribute('id', 'msg'+ table_row);
 //   ptag.setAttribute('visibility', 'hidden');
 //   td_comment.appendChild(ptag);
    //行削除ボタン
    var td_button = newrow.insertCell(-1);
    var delete_button = document.createElement("button");
    delete_button.setAttribute('id', table_row);
//    delete_button.setAttribute('classname', 'deletebuttun');
    delete_button.setAttribute('class', 'deletebutton');
    delete_button.setAttribute('onclick', 'deleterow(this)');
    var text = document.createTextNode("行削除");
    td_button.appendChild(delete_button).appendChild(text);
    table_row++;
}
//スライドショー再開ボタン押下時のイベント
function restart_slideshow(){
    now = CurrentTime();
    pause_flg = 0;
    interval = setInterval(function(){
        slideshow(res, count, interval);
        count++;
    }, 10000)
    console.log(now, '再開', interval);
    //一時停止ボタンを薄いグレーにする
    var pause_button = document.getElementById("pause_button");
    pause_button.style.backgroundColor = " #f0f0f0";
    //再開ボタンを濃いグレーにする
    var restart_button = document.getElementById("restart_button");
    restart_button.style.backgroundColor = "grey";
}
//行削除ボタン押下時のイベント ※【要修正】テーブル行数の整合性がとれていない
function deleterow(element) {
    var targetrow = element.id;
    comment_table.deleteRow(targetrow);
}
//保存ボタン押下時、①テキストエリアの入力をテキストに置き換えて②HTMLファイルを保存する。
function save() {
    console.log(table_row);
    for(var i = 1; i < table_row; i++){
        var comment_content = document.getElementById('comment_text'+ i);
        //親要素（コメント列のtd）を取得する。
        var parent = comment_content.parentElement;
        //pタグを追加する
        var ptag = document.createElement("p");
        ptag.setAttribute('id', 'msg'+ i);
        parent.appendChild(ptag);
        //console.log(parent);
//        var msg_content = document.getElementById('msg'+ i);
    //    console.log(i + ':' + comment_content.value);
        ptag.innerText = comment_content.value; 
        comment_content.remove();
    }
}
