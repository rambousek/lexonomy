var Ske={};
Ske.htmID="";

Ske.settings={
  headwordElement: "",
  examples: {containerElement: "", textElement: "", markupElement: ""}
};
Ske.makeSettings=function(){
  for(var elName in rollo){
    if(rollo[elName].headword && !Ske.settings.headwordElement) Ske.settings.headwordElement=elName;
    if(rollo[elName].exampleContainer && !Ske.settings.examples.containerElement) Ske.settings.examples.containerElement=elName;
    if(rollo[elName].exampleText && !Ske.settings.examples.textElement) Ske.settings.examples.textElement=elName;
    if(rollo[elName].exampleHeadwordMarkup && !Ske.settings.examples.markupElement) Ske.settings.examples.markupElement=elName;
  }
}
Ske.getHeadword=function(){
  var $xml=$($.parseXML(Xonomy.harvest()));
  var hwd=$xml.find(titling.headword).html();
  if(!hwd) hwd="";
  return hwd;
};
Ske.extendDocspec=function(docspec, xema){
  if(kex.corpus) {
    if(!subbing[xema.root]) {
      var elSpec=docspec.elements[xema.root];
      var incaption=elSpec.caption;
      elSpec.caption=function(jsMe){
        var cap="";
        cap="<span class='lexonomySkeCaption' onclick='Xonomy.notclick=true; Ske.menuRoot(\""+jsMe.htmlID+"\")'>▼</span>";
        if(typeof(incaption)=="function") cap=incaption(jsMe)+cap;
        if(typeof(incaption)=="string") cap=incaption+cap;
        return cap;
      };
    }
  }

  if(kex.url && kex.corpus && kex.username && kex.apikey) {
    for(var parName in xema.elements){
      if(xema.elements[parName].children){

        canHaveExamples=false;
        for(var iChild=0; iChild<xema.elements[parName].children.length; iChild++){
          if(xema.elements[parName].children[iChild].name==xampl.container){
            canHaveExamples=true; break;
          }
        }
        if(canHaveExamples){
          if(docspec.elements[parName]){
            if(!docspec.elements[parName].menu) docspec.elements[parName].menu=[];
            docspec.elements[parName].menu.push({
              icon: rootPath+"furniture/ske.png",
              caption: "Find examples <"+xampl.container+">",
              action: Ske.menuExamples,
            });
          }
        }

        canHaveCollx=false;
        for(var iChild=0; iChild<xema.elements[parName].children.length; iChild++){
          if(xema.elements[parName].children[iChild].name==collx.container){
            canHaveCollx=true; break;
          }
        }
        if(canHaveCollx){
          if(docspec.elements[parName]){
            if(!docspec.elements[parName].menu) docspec.elements[parName].menu=[];
            docspec.elements[parName].menu.push({
              icon: rootPath+"furniture/ske.png",
              caption: "Find collocations <"+collx.container+">",
              action: Ske.menuCollx,
            });
          }
        }

        canHaveThes=false;
        for(var iChild=0; iChild<xema.elements[parName].children.length; iChild++){
          if(xema.elements[parName].children[iChild].name==thes.container){
            canHaveThes=true; break;
          }
        }
        if(canHaveThes){
          if(docspec.elements[parName]){
            if(!docspec.elements[parName].menu) docspec.elements[parName].menu=[];
            docspec.elements[parName].menu.push({
              icon: rootPath+"furniture/ske.png",
              caption: "Find thesaurus items <"+thes.container+">",
              action: Ske.menuThes,
            });
          }
        }

        canHaveDefo=false;
        for(var iChild=0; iChild<xema.elements[parName].children.length; iChild++){
          if(xema.elements[parName].children[iChild].name==defo.container){
            canHaveDefo=true; break;
          }
        }
        if(canHaveDefo){
          if(docspec.elements[parName]){
            if(!docspec.elements[parName].menu) docspec.elements[parName].menu=[];
            docspec.elements[parName].menu.push({
              icon: rootPath+"furniture/ske.png",
              caption: "Find definitions <"+defo.container+">",
              action: Ske.menuDefo,
            });
          }
        }


      }
    }
  }
};

Ske.menuRoot=function(htmlID){
  var html="<div class='menu'>";
  if(xampl.container) {
    html+="<div class='menuItem' onclick='Ske.menuExamples(\""+htmlID+"\", \"layby\")'>";
      html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
      html+="Find examples <span class='techno'><span class='punc'>&lt;</span><span class='elName'>"+xampl.container+"</span><span class='punc'>&gt;</span></span>";
    html+="</div>";
  }
  if(collx.container) {
    html+="<div class='menuItem' onclick='Ske.menuCollx(\""+htmlID+"\", \"layby\")'>";
      html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
      html+="Find collocations <span class='techno'><span class='punc'>&lt;</span><span class='elName'>"+collx.container+"</span><span class='punc'>&gt;</span></span>";
    html+="</div>";
  }
  if(thes.container) {
    html+="<div class='menuItem' onclick='Ske.menuThes(\""+htmlID+"\", \"layby\")'>";
      html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
      html+="Find thesaurus items <span class='techno'><span class='punc'>&lt;</span><span class='elName'>"+thes.container+"</span><span class='punc'>&gt;</span></span>";
    html+="</div>";
  }
  if(defo.container) {
    html+="<div class='menuItem' onclick='Ske.menuDefo(\""+htmlID+"\", \"layby\")'>";
      html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
      html+="Find definitions items <span class='techno'><span class='punc'>&lt;</span><span class='elName'>"+defo.container+"</span><span class='punc'>&gt;</span></span>";
    html+="</div>";
  }
  if(Ske.getHeadword() && (kex.url.indexOf("sketchengine.co.uk")>-1 || kex.url.indexOf("sketchengine.eu")>-1)) {
    html+="<div class='menuItem')'>";
      html+="<a target='_blank' href='https://app.sketchengine.eu/#wordsketch?corpname="+kex.corpus+"&lemma="+encodeURIComponent(Ske.getHeadword())+"'>";
        html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
        html+="Show word sketch...";
      html+="</a>";
    html+="</div>";
    html+="<div class='menuItem')'>";
      html+="<a target='_blank' href='https://app.sketchengine.eu/#concordance?corpname="+kex.corpus+"&keyword="+encodeURIComponent(Ske.getHeadword())+"&showresults=1'>";
        html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
        html+="Show concordance...";
      html+="</a>";
    html+="</div>";
    html+="<div class='menuItem')'>";
      html+="<a target='_blank' href='https://app.sketchengine.eu/#thesaurus?corpname="+kex.corpus+"&lemma="+encodeURIComponent(Ske.getHeadword())+"&showresults=1'>";
        html+="<span class='icon'><img src='../../../furniture/ske.png'/></span> ";
        html+="Show thesaurus...";
      html+="</a>";
    html+="</div>";
  }
  html+="</div>";
  document.body.appendChild(Xonomy.makeBubble(html)); //create bubble
  Xonomy.showBubble($("#"+htmlID+" > .inlinecaption")); //anchor bubble to opening tag
};

Ske.menuExamples=function(htmlID, param){
  if(param=="layby") Ske.htmlID=null; else  Ske.htmlID=htmlID;
  document.body.appendChild(Xonomy.makeBubble(Ske.boxExamples())); //create bubble
  if(Xonomy.lastClickWhat=="openingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
  else if(Xonomy.lastClickWhat=="closingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
  else Xonomy.showBubble($("#"+htmlID));
  if(Ske.getHeadword()) {
    Ske.searchExamples();
  } else {
    $(".skebox .waiter").hide();
  }
};
Ske.boxExamples=function(){
  var html="";
  html="<div class='skebox'>"
    html+="<form class='topbar' onsubmit='Ske.searchExamples(); return false'>";
  		html+="<input name='val' class='textbox focusme' value='"+Ske.getHeadword()+"'/> ";
      html+="<input type='submit' class='button ske' value='&nbsp;'/>";
    html+="</form>";
    html+="<div class='waiter'></div>";
    html+="<div class='choices' style='display: none'></div>";
    html+="<div class='bottombar' style='display: none;'>";
      html+="<button class='prevnext' id='butSkeNext'>More »</button>";
      html+="<button class='prevnext' id='butSkePrev'>«</button>";
      html+="<button class='insert' onclick='Ske.insertExamples()'>Insert</button>";
    html+="</div>";
  html+="</div>";
  return html;
};
Ske.toggleExample=function(inp){
  if($(inp).prop("checked")) $(inp.parentNode).addClass("selected"); else $(inp.parentNode).removeClass("selected");
};
Ske.searchExamples=function(fromp){
  $("#butSkePrev").hide();
  $("#butSkeNext").hide();
  $(".skebox .choices").hide();
  $(".skebox .bottombar").hide();
  $(".skebox .waiter").show();
  var lemma=$.trim($(".skebox .textbox").val());
  if(lemma!="") {
    $.get(rootPath+dictID+"/skeget/xampl/", {url: kex.url, corpus: kex.corpus, username: kex.username, apikey: kex.apikey, lemma: lemma, fromp: fromp}, function(json){
        $(".skebox .choices").html("");
        if(json.error && json.error=="Empty result"){
          $(".skebox .choices").html("<div class='error'>No results found.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
        else if(json.Lines) {
          if(json.prevlink) $("#butSkePrev").show().on("click", function(){ Ske.searchExamples(json.prevlink); $("div.skebox button.prevnext").off("click"); });
          if(json.nextlink) $("#butSkeNext").show().on("click", function(){ Ske.searchExamples(json.nextlink); $("div.skebox button.prevnext").off("click"); });
          for(var iLine=0; iLine<json.Lines.length; iLine++){ var line=json.Lines[iLine];
            var left=""; for(var i=0; i<line.Left.length; i++) left+=line.Left[i].str; left=left.replace(/\<[^\<\>]+\>/g, "");
            var kwic=""; for(var i=0; i<line.Kwic.length; i++) kwic+=line.Kwic[i].str; kwic=kwic.replace(/<[^\<\>]+\>/g, "");
            var right=""; for(var i=0; i<line.Right.length; i++) right+=line.Right[i].str; right=right.replace(/<[^\<\>]+\>/g, "");
            var txt=left+"<b>"+kwic+"</b>"+right;
            txt=txt.replace("<b> ", " <b>");
            txt=txt.replace(" </b>", "</b> ");
            $(".skebox .choices").append("<label><input type='checkbox' onchange='Ske.toggleExample(this)'/><span class='inside'>"+txt+"</span></label>");
            $(".skebox .waiter").hide();
            $(".skebox .choices").fadeIn();
            $(".skebox .bottombar").show();
          }
        } else {
          $(".skebox .choices").html("<div class='error'>There has been an error getting data from Sketch Engine.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
    });
  }
};
Ske.insertExamples=function(){
  $(".skebox div.choices label").each(function(){
    var $label=$(this);
    if($label.hasClass("selected")){
      var txt=$label.find("span.inside").html();
      if(xampl.markup) {
        txt=txt.replace("<b>", "<"+xampl.markup+">");
        txt=txt.replace("</b>", "</"+xampl.markup+">");
      } else {
        txt=txt.replace("<b>", "");
        txt=txt.replace("</b>", "");
      }
      var xml=xampl.template.replace("$text", txt);
      if(Ske.htmlID) Xonomy.newElementChild(Ske.htmlID, xml); else Xonomy.newElementLayby(xml);
    }
  });
};

Ske.menuThes=function(htmlID, param){
  if(param=="layby") Ske.htmlID=null; else  Ske.htmlID=htmlID;
  document.body.appendChild(Xonomy.makeBubble(Ske.boxThes())); //create bubble
  if(Xonomy.lastClickWhat=="openingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
  else if(Xonomy.lastClickWhat=="closingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
  else Xonomy.showBubble($("#"+htmlID));
  if(Ske.getHeadword()) {
    Ske.searchThes();
  } else {
    $(".skebox .waiter").hide();
  }
};
Ske.boxThes=function(){
  var html="";
  html="<div class='skebox'>"
    html+="<form class='topbar' onsubmit='Ske.searchThes(); return false'>";
  		html+="<input name='val' class='textbox focusme' value='"+Ske.getHeadword()+"'/> ";
      html+="<input type='submit' class='button ske' value='&nbsp;'/>";
    html+="</form>";
    html+="<div class='waiter'></div>";
    html+="<div class='choices' style='display: none'></div>";
    html+="<div class='bottombar' style='display: none;'>";
      html+="<button class='prevnext' id='butSkeNext'>More »</button>";
      html+="<button class='prevnext' id='butSkePrev'>«</button>";
      html+="<button class='insert' onclick='Ske.insertThes()'>Insert</button>";
    html+="</div>";
  html+="</div>";
  return html;
};
Ske.toggleThes=function(inp){
  if($(inp).prop("checked")) $(inp.parentNode).addClass("selected"); else $(inp.parentNode).removeClass("selected");
};
Ske.searchThes=function(fromp){
  $("#butSkePrev").hide();
  $("#butSkeNext").hide();
  $(".skebox .choices").hide();
  $(".skebox .bottombar").hide();
  $(".skebox .waiter").show();
  var lemma=$.trim($(".skebox .textbox").val());
  if(lemma!="") {
    $.get(rootPath+dictID+"/skeget/thes/", {url: kex.url, corpus: kex.corpus, username: kex.username, apikey: kex.apikey, lemma: lemma, fromp: fromp}, function(json){
        $(".skebox .choices").html("");
        if(json.error && json.error=="Empty result"){
          $(".skebox .choices").html("<div class='error'>No results found.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }

        // $(".skebox .choices").append(JSON.stringify(json, null, "  "));
        // $(".skebox .waiter").hide();
        // $(".skebox .choices").fadeIn();

        else if(json.Words) {
          // if(json.prevlink) $("#butSkePrev").show().on("click", function(){ Ske.searchExamples(json.prevlink); $("div.skebox button.prevnext").off("click"); });
          // if(json.nextlink) $("#butSkeNext").show().on("click", function(){ Ske.searchExamples(json.nextlink); $("div.skebox button.prevnext").off("click"); });
          for(var iLine=0; iLine<json.Words.length; iLine++){ var line=json.Words[iLine];
            var txt=line.word;
            $(".skebox .choices").append("<label><input type='checkbox' onchange='Ske.toggleThes(this)'/><span class='inside'>"+txt+"</span></label>");
            $(".skebox .waiter").hide();
            $(".skebox .choices").fadeIn();
            $(".skebox .bottombar").show();
          }
        } else {
          $(".skebox .choices").html("<div class='error'>There has been an error getting data from Sketch Engine.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
    });
  }
};
Ske.insertThes=function(){
  $(".skebox div.choices label").each(function(){
    var $label=$(this);
    if($label.hasClass("selected")){
      var txt=$label.find("span.inside").html();
      var xml=thes.template.replace("$text", txt);
      if(Ske.htmlID) Xonomy.newElementChild(Ske.htmlID, xml); else Xonomy.newElementLayby(xml);
    }
  });
};

Ske.menuCollx=function(htmlID, param){
  if(param=="layby") Ske.htmlID=null; else  Ske.htmlID=htmlID;
  document.body.appendChild(Xonomy.makeBubble(Ske.boxCollx())); //create bubble
  if(Xonomy.lastClickWhat=="openingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
  else if(Xonomy.lastClickWhat=="closingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
  else Xonomy.showBubble($("#"+htmlID));
  if(Ske.getHeadword()) {
    Ske.searchCollx();
  } else {
    $(".skebox .waiter").hide();
  }
};
Ske.boxCollx=function(){
  var html="";
  html="<div class='skebox'>"
    html+="<form class='topbar' onsubmit='Ske.searchCollx(); return false'>";
  		html+="<input name='val' class='textbox focusme' value='"+Ske.getHeadword()+"'/> ";
      html+="<input type='submit' class='button ske' value='&nbsp;'/>";
    html+="</form>";
    html+="<div class='waiter'></div>";
    html+="<div class='choices' style='display: none'></div>";
    html+="<div class='bottombar' style='display: none;'>";
      html+="<button class='prevnext' id='butSkeNext'>More »</button>";
      html+="<button class='prevnext' id='butSkePrev'>«</button>";
      html+="<button class='insert' onclick='Ske.insertCollx()'>Insert</button>";
    html+="</div>";
  html+="</div>";
  return html;
};
Ske.toggleCollx=function(inp){
  if($(inp).prop("checked")) $(inp.parentNode).addClass("selected"); else $(inp.parentNode).removeClass("selected");
};
Ske.searchCollx=function(fromp){
  $("#butSkePrev").hide();
  $("#butSkeNext").hide();
  $(".skebox .choices").hide();
  $(".skebox .bottombar").hide();
  $(".skebox .waiter").show();
  var lemma=$.trim($(".skebox .textbox").val());
  if(lemma!="") {
    $.get(rootPath+dictID+"/skeget/collx/", {url: kex.url, corpus: kex.corpus, username: kex.username, apikey: kex.apikey, lemma: lemma, fromp: fromp}, function(json){
        $(".skebox .choices").html("");
        if(json.error && json.error=="Empty result"){
          $(".skebox .choices").html("<div class='error'>No results found.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }

        // $(".skebox .choices").append(JSON.stringify(json, null, "  "));
        // $(".skebox .waiter").hide();
        // $(".skebox .choices").fadeIn();

        else if(json.Items) {
          // if(json.prevlink) $("#butSkePrev").show().on("click", function(){ Ske.searchExamples(json.prevlink); $("div.skebox button.prevnext").off("click"); });
          // if(json.nextlink) $("#butSkeNext").show().on("click", function(){ Ske.searchExamples(json.nextlink); $("div.skebox button.prevnext").off("click"); });
          for(var iLine=0; iLine<json.Items.length; iLine++){ var line=json.Items[iLine];
            var txt=line.word;
            $(".skebox .choices").append("<label><input type='checkbox' onchange='Ske.toggleCollx(this)'/><span class='inside'>"+txt+"</span></label>");
            $(".skebox .waiter").hide();
            $(".skebox .choices").fadeIn();
            $(".skebox .bottombar").show();
          }
        } else {
          $(".skebox .choices").html("<div class='error'>There has been an error getting data from Sketch Engine.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
    });
  }
};
Ske.insertCollx=function(){
  $(".skebox div.choices label").each(function(){
    var $label=$(this);
    if($label.hasClass("selected")){
      var txt=$label.find("span.inside").html();
      var xml=collx.template.replace("$text", txt);
      if(Ske.htmlID) Xonomy.newElementChild(Ske.htmlID, xml); else Xonomy.newElementLayby(xml);
    }
  });
};

Ske.menuDefo=function(htmlID, param){
  if(param=="layby") Ske.htmlID=null; else  Ske.htmlID=htmlID;
  document.body.appendChild(Xonomy.makeBubble(Ske.boxDefo())); //create bubble
  if(Xonomy.lastClickWhat=="openingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
  else if(Xonomy.lastClickWhat=="closingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
  else Xonomy.showBubble($("#"+htmlID));
  if(Ske.getHeadword()) {
    Ske.searchDefo();
  } else {
    $(".skebox .waiter").hide();
  }
};
Ske.boxDefo=function(){
  var html="";
  html="<div class='skebox'>"
    html+="<form class='topbar' onsubmit='Ske.searchDefo(); return false'>";
  		html+="<input name='val' class='textbox focusme' value='"+Ske.getHeadword()+"'/> ";
      html+="<input type='submit' class='button ske' value='&nbsp;'/>";
    html+="</form>";
    html+="<div class='waiter'></div>";
    html+="<div class='choices' style='display: none'></div>";
    html+="<div class='bottombar' style='display: none;'>";
      html+="<button class='prevnext' id='butSkeNext'>More »</button>";
      html+="<button class='prevnext' id='butSkePrev'>«</button>";
      html+="<button class='insert' onclick='Ske.insertDefo()'>Insert</button>";
    html+="</div>";
  html+="</div>";
  return html;
};
Ske.toggleDefo=function(inp){
  if($(inp).prop("checked")) $(inp.parentNode).addClass("selected"); else $(inp.parentNode).removeClass("selected");
};
Ske.searchDefo=function(fromp){
  $("#butSkePrev").hide();
  $("#butSkeNext").hide();
  $(".skebox .choices").hide();
  $(".skebox .bottombar").hide();
  $(".skebox .waiter").show();
  var lemma=$.trim($(".skebox .textbox").val());
  if(lemma!="") {
    $.get(rootPath+dictID+"/skeget/defo/", {url: kex.url, corpus: kex.corpus, username: kex.username, apikey: kex.apikey, lemma: lemma, fromp: fromp}, function(json){
        $(".skebox .choices").html("");
        if(json.error && json.error=="Empty result"){
          $(".skebox .choices").html("<div class='error'>No results found.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
        else if(json.Lines) {
          if(json.prevlink) $("#butSkePrev").show().on("click", function(){ Ske.searchExamples(json.prevlink); $("div.skebox button.prevnext").off("click"); });
          if(json.nextlink) $("#butSkeNext").show().on("click", function(){ Ske.searchExamples(json.nextlink); $("div.skebox button.prevnext").off("click"); });
          for(var iLine=0; iLine<json.Lines.length; iLine++){ var line=json.Lines[iLine];
            var left=""; for(var i=0; i<line.Left.length; i++) left+=line.Left[i].str; left=left.replace(/\<[^\<\>]+\>/g, "");
            var kwic=""; for(var i=0; i<line.Kwic.length; i++) kwic+=line.Kwic[i].str; kwic=kwic.replace(/<[^\<\>]+\>/g, "");
            var right=""; for(var i=0; i<line.Right.length; i++) right+=line.Right[i].str; right=right.replace(/<[^\<\>]+\>/g, "");
            //var txt=left+"<b>"+kwic+"</b>"+right;
            var txt=left+kwic+right;
            // txt=txt.replace("<b> ", " <b>");
            // txt=txt.replace(" </b>", "</b> ");
            $(".skebox .choices").append("<label><input type='checkbox' onchange='Ske.toggleDefo(this)'/><span class='inside'>"+txt+"</span></label>");
            $(".skebox .waiter").hide();
            $(".skebox .choices").fadeIn();
            $(".skebox .bottombar").show();
          }
        } else {
          $(".skebox .choices").html("<div class='error'>There has been an error getting data from Sketch Engine.</div>");
          $(".skebox .waiter").hide();
          $(".skebox .choices").fadeIn();
        }
    });
  }
};
Ske.insertDefo=function(){
  $(".skebox div.choices label").each(function(){
    var $label=$(this);
    if($label.hasClass("selected")){
      var txt=$label.find("span.inside").html();
      // if(xampl.markup) {
      //   txt=txt.replace("<b>", "<"+xampl.markup+">");
      //   txt=txt.replace("</b>", "</"+xampl.markup+">");
      // } else {
      //   txt=txt.replace("<b>", "");
      //   txt=txt.replace("</b>", "");
      // }
      var xml=defo.template.replace("$text", txt);
      if(Ske.htmlID) Xonomy.newElementChild(Ske.htmlID, xml); else Xonomy.newElementLayby(xml);
    }
  });
};
