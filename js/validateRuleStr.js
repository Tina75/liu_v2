/**
	验证规则表达式脚本
*/
//当前文本框中的内容
var inputstr;

//出现第二个待校验的字节是之前的内容
var beforestr;

//左关键字
var beforeKey;

//当前文本框中待校验内容
var str;

//union起始位置指针
var begainpos = "0";

//获取待校验内容的开始指针
var startpos = 0;

//获取待校验的结束指针
var endpos = 0;

//标记出现第几个待校验的对象了
var validate_marks = "leftbar";

var validate_mark;

//当前操作的input的DOM对象
var inputEle;

//临时关键字数组
var currentKeyWords = [];

//正确的背景颜色
var VALIDATE_TURE_CLORE = "#529209ab";

//错误的背景颜色
var VALIDATE_FALSE_CLORE = "#ff5722ed";

//默认背景
var VALIDATE_DEFAULT_CLORE = "#ffff"

//记录下currentKeyWords 为0时之前用户输入的单个关键字
var inputKeyWord ;

//当前关键字适配的关系符号
var current_inputKeyWord_relation = [];

//当前inputKeyWord对应的值的判断条件
var current_inputKeyWord_condition;


var totallength;

//标记循环到第几个input
var switchIndex;

//验证返回信息对象
var returnData = {	resultCode:"",
					resultMsg:""}

/**
	* 验证入口函数
	* @Param:id:规则输入文本框的Id属性
*/
function validateInputRule (id){
	inputEle = document.getElementsByClassName(id);
	console.log(inputEle)
	for(var i = 0; i < inputEle.length; i++){
		switchIndex = i;
        inputEle[i].onkeyup = function(){
            inputstr = this.value;
            if(inputstr.length == 0) {
                this.style.backgroundColor = VALIDATE_DEFAULT_CLORE;
                return;
            }
            //去掉开头的空格
            inputstr = inputstr.trimLeft();

            inputstr = inputstr.substring(begainpos);
            //实时输入的总长度
            totallength = inputstr.length;
            startpos = 0;
            endpos = 1;
            validate_marks = "leftbar";
            validateDetails(inputstr);
        }
	}

}
function validateDetails(inputstrParam) {
		
		
		//待验证的str
		str = inputstrParam.substring(startpos,endpos);

		//当前输入的字节为不是空格，之前一个位置是空格，此时需要重置：validate_marks,startpost和endpos
		if(checkcurrentisblankandbeforisnotblank(str)) {
			if(validate_marks == "leftbar"){
				validate_marks  = "middlebar";
			}else if(validate_marks == "middlebar") {
				validate_marks = "rightbar";
			}else if(validate_marks == "rightbar"){
				validate_marks = "relationbar";
			}else if(validate_marks == "relationbar"){
				//....
			}
			
			if(validate_marks == "middlebar"){
				str = str.substring(0,str.length - 1);
				var relationStart = str.length;
				//去除当前str的结束位置的空格
				checklastofstrisblank();
				inputKeyWord = str;
				//重置startpos
				startpos = relationStart;
				str = inputstrParam.substring(relationStart,endpos);
			}
			if(validate_marks == "rightbar") {
				var rightStart = inputstrParam.indexOf(str) + str.length - 1;
				//重置startpos
				startpos = rightStart;
				str = inputstrParam.substring(startpos,endpos);
			}

			if(validate_marks == "relationbar"){
				var concatStart = inputstrParam.indexOf(str) + str.length - 1;
				//重置startpos
				startpos = concatStart;
				str = inputstrParam.substring(startpos,endpos);
			}
			
		}
		//左节点
		if(validate_marks == "leftbar") {
			checklastofstrisblank();
			if(validataRuleStr()){
				inputEle[switchIndex].style.backgroundColor = VALIDATE_TURE_CLORE;
				
			}else {
				inputEle[switchIndex].style.backgroundColor = VALIDATE_FALSE_CLORE;
				
			}
		}
		
		//关系符号
		if(validate_marks == "middlebar") {
			checklastofstrisblank();
			
			//根据当前用户输入的关键字获取该关键之适配的关系符号
			current_inputKeyWord_relation = getRelationByKeyWord(inputKeyWord);

			if(validaterelation()){
				inputEle[switchIndex].style.backgroundColor = VALIDATE_TURE_CLORE;
				
			}else {
				inputEle[switchIndex].style.backgroundColor = VALIDATE_FALSE_CLORE;
				
			}
		}

		//右值格式验证,右值的验证不能按照实时的验证，
		//默认的是在输入值的时候，一旦出现空格表示值的输入结束，开始验证值的格式
		if(validate_marks == "rightbar") {
			checklastofstrisblank();
			//开始验证此时输入的值格式是否合法
			getConditionByKeyWord(inputKeyWord);
			if(new RegExp(current_inputKeyWord_condition).test(str)) {
				inputEle[switchIndex].style.backgroundColor = VALIDATE_TURE_CLORE;
				
			}else {
				inputEle[switchIndex].style.backgroundColor = VALIDATE_FALSE_CLORE;
				
			}
			
		}

		//逻辑关系符号
		if(validate_marks == "relationbar") {
			checklastofstrisblank();
			if(validateConcatLuo()){
				inputEle[switchIndex].style.backgroundColor = VALIDATE_TURE_CLORE;
				if(" " == inputstrParam.substr(inputstrParam.length - 1,1)){
					begainpos = parseInt(begainpos) + inputstrParam.length;
					startpos = "0";
					validate_marks = "leftbar";
					currentKeyWords = [];
				}
			}else {
				inputEle[switchIndex].style.backgroundColor = VALIDATE_FALSE_CLORE;
			}
		}
		endpos ++;
		if(endpos <= totallength){
			validateDetails(inputstrParam);
		}

}

//验证实时输入的表达式
function validataRuleStr() {
	//根据用户输入的关键字的开头字符获取后续合法关键字数组
	currentKeyWords = getCurrentKeyWords();
	console.log("current:"+currentKeyWords.length);
	console.log("keyWord:" + keyWords.length);
	if(currentKeyWords.length < 1) {
		return false;
	}
	if(currentKeyWords.length >= 1){
		return true;
	}
}

//获取临时合法关键字数组
function getCurrentKeyWords(str){
	/*//递归替换临时关键字数组
	if(currentKeyWords.length != 0){
		keyWords = currentKeyWords;
	}*/
	//每次获取临时关键字数组之前需要清空上次的临时数组
	currentKeyWords = new Array();
	for (var i = 0,length = keyWords.length; i < length; i++) {
		if(keyWordStartWithStr(keyWords[i])){
			currentKeyWords.push(keyWords[i]);
			continue;
		}else{
			continue;
		}
	}
	return currentKeyWords;
}

//判断关键字是否是以用户输入的字符串开头
function keyWordStartWithStr(keyWord) {
	if(keyWord.indexOf(str) == 0) {
		//表示以输入的字符串开头
		return true;
	}
	return false;
}

//根据关键之适配关系符号
function getRelationByKeyWord(inputKeyWord) {
	// 暂时只返回“==”
	var relationArray = new Array();
	for(var index = 0,length = judgeargs.length;index < length;index ++){
		if(judgeargs[index].name == inputKeyWord){
			relationArray = judgeargs[index].judgearg.split(",");
		}
	}
	return relationArray;
}

//根据关键字适配该关键字的值的格式
function getConditionByKeyWord(inputKeyWord) {
	// body.../^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/

	//暂时的IP正则
	//current_inputKeyWord_condition = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	for(var index = 0,length = judgeargs.length;index < length;index ++){
		if(judgeargs[index].name == inputKeyWord){
			current_inputKeyWord_condition = judgeargs[index].valuearg;
		}
	}
}

//递归判断删除当前关键字的结束位置是否为空格,如果是空格就删除空格
function checklastofstrisblank() {
	var lastChar = str.substr(str.length - 1,1);
	if(" " == lastChar){
		str = str.substring(0,str.length - 1);
		checklastofstrisblank(str);
	}else{
		return;
	}
}

//判断当前位置不为为空，当前位置的前一个位置不为为空，表示前一个待判断的str结束
function checkcurrentisblankandbeforisnotblank(inputParam) {
	var current_seq = inputParam.substr(inputParam.length - 1,1);
	var current_seqbelow = inputParam.substr(inputParam.length - 2,1);
	if(" " != current_seq && current_seqbelow == " "){
		return true;//表示结束
	}else {
		return false;//表示未结束
	}
}

//判断一个最小子单元表达式结束
function checkmiuexp_end(inputParam) {
	// body...
	var current_seq = inputParam.substr(endpos - 1,1);
	var current_seqbelow = inputParam.substr(endpos - 2,1);
	if(" " != current_seq && current_seqbelow == " " && validateCharisLuo(current_seq)){
		return true;//表示结束
	}else {
		return false;//表示未结束
	}
}

//判断当前字节在["&&","||"]
function validateCharisLuo(char) {
	// body...
	if(char == "&" || char == "|") {
		return true;
	}
	return false;
}

//判断str是不是逻辑连接符号
function validateConcatLuo (){
	var concatLuo = ["&&","||"];
	for(var index = 0,length = concatLuo.length;index < length;index ++){
		if(concatLuo[index].indexOf(str) > -1) {
			return true;
		}
	}
	return false;
}

//判断用户输入的关系符号是否是关联的合法关系符号
function validaterelation() {
	for(var i = 0,length = current_inputKeyWord_relation.length;i < length;i++){
		if(current_inputKeyWord_relation[i].indexOf(str) > -1){
			return true;
		}
	}
	return false;
}


var judgeargs = [
				{"name":"ip.src","judgearg":"==,!=","valuearg":/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/},
				{"name":"ip.dst","judgearg":"==,!=","valuearg":/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/},
				{"name":"ip.len","judgearg":"==,!=,>,>=,<,<=","valuearg":/^\+?[1-9][0-9]*$/},
				{"name":"ip.payload","judgearg":"==,!=","valuearg":/^\+?[1-9][0-9]*$/},
				{"name":"ip.payload.len","judgearg":"==,!=,>,>=,<,<=","valuearg":/^\+?[1-9][0-9]*$/},
				{"name":"ip.proto","judgearg":"==,!=,>,>=,<,<=","valuearg":/^\+?[1-9][0-9]*$/},
				{"name":"ip.hdr","judgearg":"==,!=","valuearg":/^\+?[a-z]|[1-9][0-9]*$/},
				{"name":"ip.hdr_len","judgearg":"==,!=,>,>=,<,<=","valuearg":/^\+?[1-9][0-9]*$/}];
//所有合法的关键字数组
var keyWords = ["ip.src",
			"ip.dst",
			"ip.len",
			"ip.payload",
			"ip.payload.len",
			"ip.proto",
			"ip.hdr",
			"ip.hdr_len",
			"ipv6.src",                     
			"ipv6.dst",                      
			"ipv6.proto",                    
			"ipv6.len",                      
			"ipv6.hdr",
			"ipv6.hdr_len",                  
			"ipv6.payload",                  
			"ipv6.payload.len",              
			"icmp.type",
			"icmp.code",
			"icmp.checksum",
			"icmp.payload",
			"icmp.payload.len",
			"icmp.id",
			"icmp.seq",
			"tcp.srcport",
			"tcp.dstport",
			"tcp.flags",
			"tcp.seq",
			"tcp.payload",
			"tcp.payload.len",
			"udp.srcport",
			"udp.dstport",
			"udp.payload",
			"udp.payload.len",
			"http.url",
			"http.url.len",
			"http.cache_control",
			"http.cache_control.len",
			"http.connection",
			"http.connection.len",
			"http.date",
			"http.date.len",
			"http.accept",
			"http.accept.len",
			"http.host",
			"http.host.len",
			"http.referer",
			"http.referer.len",
			"http.user_agent",
			"http.user_agent.len",
			"http.cookie",
			"http.cookie.len",
			"http.accept_ranges",
			"http.accept_ranges.len",
			"http.location",
			"http.location.len",
			"http.allow",
			"http.allow.len",
			"http.msgbody0",
			"http.msgbody0.len",
			"http.method",
			"ftp.user",
			"ftp.user.len",
			"ftp.passwd",
			"ftp.passwd.len",
			"ftp.cmd",
			"ftp.cmd.len",
			"ftp.retcode",
			"ftp.retcode.len",
			"ftp.filename",
			"ftp.filename.len",
			"smtp.user",
			"smtp.user.len",
			"smtp.user_base64",
			"smtp.user_base64.len",
			"smtp.passwd",
			"smtp.passwd.len",
			"smtp.passwd_base64",
			"smtp.passwd_base64.len",
			"smtp.from",
			"smtp.from.len",
			"smtp.to",
			"smtp.to.len",
			"smtp.cc",
			"smtp.cc.len",
			"smtp.date",
			"smtp.date.len",
			"smtp.subject",
			"smtp.subject.len",
			"smtp.x_mailer",
			"smtp.x_mailer.len",
			"smtp.message_id",
			"smtp.message_id.len",
			"smtp.mime_version",
			"smtp.mime_version.len",
			"smtp.content_type",
			"smtp.content_type.len",
			"smtp.filename",
			"smtp.filename.len",
			"smtp.file",
			"smtp.file.len",
			"smtp.msgbody",
			"smtp.msgbody.len",
			"pop3.user",
			"pop3.user.len",
			"pop3.passwd",
			"pop3.passwd.len",
			"pop3.from",
			"pop3.from.len",
			"pop3.to",
			"pop3.to.len",
			"pop3.cc",
			"pop3.cc.len",
			"pop3.date",
			"pop3.date.len",
			"pop3.subject",
			"pop3.subject.len",
			"pop3.x_mailer",
			"pop3.x_mailer.len",
			"pop3.message_id",
			"pop3.message_id.len",
			"pop3.mime_version",
			"pop3.mime_version.len",
			"pop3.content_type",
			"pop3.content_type.len",
			"pop3.filename",
			"pop3.filename.len",
			"pop3.file",
			"pop3.file.size",
			"pop3.msgbody",
			"pop3.msgbody.len",
			"dns.flags",
			"dns.qry.type",
			"dns.qry.class",
			"dns.ip.count",
			"dns.ip",
			"dns.ip.len",
			"dns.qry.name",
			"dns.qry.name.len",
			"dns.resp.name",
			"dns.resp.name.len" ]