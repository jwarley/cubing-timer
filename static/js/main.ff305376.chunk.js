(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{148:function(e,t,a){e.exports=a(272)},272:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),r=a(61),i=a.n(r);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var c,l=a(52),o=a(41),u=a(43),p=a(44),h=a(7),d=a(45),m=a(8),b=a(13);a(69);function v(e){return Date.now()-e}function _(e){if(-1===e)return"DNF";var t=Math.floor(e%(100*Math.pow(60,3))/(100*Math.pow(60,2))),a=Math.floor(e%(100*Math.pow(60,2))/6e3),n=Math.floor(e%6e3/100),s="";return 0!==t&&(s=s+t+":"),0!==t&&a<10&&(s+="0"),0!==a&&(s=s+a+":"),0!==a&&n<10&&(s+="0"),s=s+n+"."+function(e){console.assert(e>=0&&e<100,"Invalid argument to padCs() ("+e+")");var t="";return e<10?t=t+"0"+e:e<100&&(t+=e),t}(Math.floor(e%100))}function g(e){var t=_(e.raw);return e.pen===c.DNF?"DNF ("+t+")":e.pen===c.PlusTwo?_(e.raw+200):t}function f(e){return{raw:e.raw,pen:(t=e.pen,t===c.DNF?"dnf":t===c.PlusTwo?"plus":"")};var t}function w(e){return{raw:e.raw,pen:(t=e.pen,"dnf"===t?c.DNF:"plus"===t?c.PlusTwo:void 0)};var t}function y(e){return e.pen===c.DNF?-1:e.pen===c.PlusTwo?e.raw+200:e.raw}function j(e,t){var a=-1===e,n=-1===t;return!(a&&!n)&&(!(a||!n)||(!a||!n)&&e<t)}function O(e,t){var a=e.pen===c.DNF,n=t.pen===c.DNF;return a&&!n?1:!a&&n?-1:a&&n?0:y(e)-y(t)}!function(e){e[e.DNF=0]="DNF",e[e.PlusTwo=1]="PlusTwo"}(c||(c={}));var E=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return"minx"===this.props.event.scramble_str?n.createElement("div",{id:"scramble_area",className:"f3 tc",style:{whiteSpace:"pre-wrap"}},this.props.scramble):n.createElement("div",{id:"scramble_area",className:"f3 tc"},this.props.scramble)}}]),t}(n.PureComponent),k=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){for(var e=this,t=n.createElement("span",{className:""},n.createElement("a",{className:"link dim br1 bt bb bl ph1 dib black pointer",onClick:function(){return e.props.edit_fn(c.PlusTwo)}},"+2"),n.createElement("a",{className:"link dim br1 ba ph1 dib black pointer",onClick:function(){return e.props.edit_fn(c.DNF)}},"DNF"),n.createElement("a",{className:"link dim br1 bt bb br ph1 dib black pointer",onClick:function(){return e.props.delete_fn()}},"\xd7")),a=[],s=this.props.times.length,r=0;r<s;r++){var i=this.props.times[r];a[r]=n.createElement("li",{key:r,className:"flex justify-between ph2 pv2 bb b--light-silver"},g(i),r===s-1?t:"")}for(;a.length<this.props.avg_size;)a.push(n.createElement("li",{key:a.length,className:"ph2 pv2 bb b--light-silver"},"\xa0"));return n.createElement("div",{className:"center mw5"},n.createElement("h1",{className:"f5 small-caps"},"Current Average"),n.createElement("ul",{className:"list pl0 ml0 ba b--light-silver br1"},a))}}]),t}(n.PureComponent),N=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e=this;this.props.event.avg_size;return n.createElement("div",{className:"outline"},n.createElement("dl",{className:"lh-title ml3"},n.createElement("dt",{className:"f6 b"},"Best Single"),-2===this.props.stats.pb_single?n.createElement("dd",{className:"ml0"},"N/A"):n.createElement("dd",{className:"ml0"},n.createElement("span",{className:"pointer bg-animate bg-white hover-bg-light-silver",onClick:function(){return e.props.inspect_func(e.props.stats.pb_single_loc)}},_(this.props.stats.pb_single))),n.createElement("dt",{className:"f6 b"},"Best Avg."),null===this.props.stats.pb_avg||null===this.props.stats.pb_avg_loc?n.createElement("dd",{className:"ml0"},"N/A"):n.createElement("dd",{className:"ml0"},n.createElement("span",{className:"pointer bg-animate bg-white hover-bg-light-silver",onClick:function(){return e.props.inspect_func(e.props.stats.pb_avg_loc)}},_(this.props.stats.pb_avg)))))}}]),t}(n.PureComponent);function S(e){var t=void 0;return e>=17e3?t=c.DNF:e>=15e3&&(t=c.PlusTwo),t}function D(e){var t=Math.floor(e%(1e3*Math.pow(60,3))/(1e3*Math.pow(60,2))),a=Math.floor(e%(1e3*Math.pow(60,2))/6e4),n=Math.floor(e%6e4/1e3),s="";return 0!==t&&(s=s+t+":"),0!==t&&a<10&&(s+="0"),0!==a&&(s=s+a+":"),0!==a&&n<10&&(s+="0"),s=s+n+"."+function(e){console.assert(e>=0&&e<1e3,"Invalid argument to padMs() ("+e+")");var t="";return e<10?t=t+"00"+e:e<100?t=t+"0"+e:e<1e3&&(t+=e),t}(Math.floor(e%1e3))}var C=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e,t,a="black";return"red"===this.props.phase.name?a="red":"green"===this.props.phase.name&&(a="green"),e="inspecting"===this.props.phase.name||"red"===this.props.phase.name||"green"===this.props.phase.name?(t=this.props.ms)>=17e3?"DNF":t>=15e3?"+2":(15-Math.floor(t%6e4/1e3)).toString():"stopped"!==this.props.phase.name&&"waiting"!==this.props.phase.name||void 0===this.props.pen?D(this.props.ms):function(e,t){var a=D(e);return t===c.DNF?"DNF ("+a+")":t===c.PlusTwo?a+" + 2 = "+D(e+2e3):a}(this.props.ms,this.props.pen),n.createElement("p",{id:"timer_text",className:"noselect w-100 tc f1 code "+a},e)}}]),t}(n.Component),x=function(e){function t(e){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).call(this,e))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"hist_to_list_items",value:function(e){var t=this,a=[],s=function(s){a.push(n.createElement("li",{key:s,className:"bg-animate bg-white hover-bg-light-silver pointer",onClick:function(){return t.props.inspect_func(s)}},n.createElement("b",{className:"pt1"},_(e[s].avg)),n.createElement("div",null,e[s].times.map(_).join(" "))))};for(var r in e)s(r);return a}},{key:"render",value:function(){return n.createElement("div",{className:"dn db-ns overflow-auto"},n.createElement("ul",{className:"list pl0 mv0"},this.hist_to_list_items(this.props.hist)),n.createElement("div",{className:"pv3 tc"},n.createElement("a",{className:"ba pointer ph1",onClick:this.props.load_more_func},"Load more")))}}]),t}(n.PureComponent),T=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e=this;return n.createElement("div",null,n.createElement("h1",{className:"f4 bg-near-black white mv0 pv2 ph3"},"Average detail"),n.createElement("div",{className:"pa3 bt"},n.createElement("p",{className:"f6 f5-ns lh-copy measure mv0"},_(this.props.avg_json.avg)),n.createElement("p",{className:"f6 f5-ns lh-copy measure mv0"},this.props.avg_json.times.map(_).join(" "))),n.createElement("div",{className:"pv3 tc"},n.createElement("a",{className:"ba pointer ph1",onClick:function(){e.props.delete_func(e.props.avg_id),e.props.close_func()}},"Delete Average")),n.createElement("div",{className:"pv3 tc"},n.createElement("a",{className:"ba pointer ph1",onClick:this.props.close_func},"Close")))}}]),t}(n.PureComponent),I=a(147),A=function(e){function t(){var e,a;Object(u.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(h.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(s)))).eventOptions=[{name:"2x2x2",avg_size:5,scramble_str:"222",wca_db_str:"222"},{name:"3x3x3",avg_size:5,scramble_str:"333",wca_db_str:"333"},{name:"4x4x4",avg_size:5,scramble_str:"444fast",wca_db_str:"444"},{name:"5x5x5",avg_size:5,scramble_str:"555",wca_db_str:"555"},{name:"6x6x6",avg_size:3,scramble_str:"666",wca_db_str:"666"},{name:"7x7x7",avg_size:3,scramble_str:"777",wca_db_str:"777"},{name:"3x3x3 OH",avg_size:5,scramble_str:"333",wca_db_str:"333oh"},{name:"3x3x3 BLD",avg_size:3,scramble_str:"333",wca_db_str:"333bf"},{name:"Pyraminx",avg_size:5,scramble_str:"pyram",wca_db_str:"pyram"},{name:"Megaminx",avg_size:5,scramble_str:"minx",wca_db_str:"minx"},{name:"Square-1",avg_size:5,scramble_str:"sq1",wca_db_str:"sq1"},{name:"Clock",avg_size:5,scramble_str:"clock",wca_db_str:"clock"},{name:"Skewb",avg_size:5,scramble_str:"skewb",wca_db_str:"skewb"}],a}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return n.createElement(n.Fragment,null,n.createElement(I.a,{id:"event_select",onChange:this.props.onChange,isDisabled:this.props.isDisabled,defaultValue:this.eventOptions[1],options:this.eventOptions,theme:function(e){return Object(o.a)({},e,{borderRadius:0,colors:Object(o.a)({},e.colors,{primary25:"gray",primary:"black"})})},getOptionLabel:function(e){return e.name},openMenuOnFocus:!0,blurInputOnSelect:!0,styles:{menuList:function(e){return{maxHeight:500}}},isOptionSelected:function(e,t){return!1}}))}}]),t}(n.PureComponent),z=a(139),M=a.n(z),P=(a(108),{callbacks:{signInSuccessWithAuthResult:function(e,t){return!1}},signInFlow:"redirect",signInSuccessUrl:"",signInOptions:[l.auth.GoogleAuthProvider.PROVIDER_ID],tosUrl:"<your-tos-url>",privacyPolicyUrl:"<your-privacy-policy-url>"}),U=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return this.props.user?n.createElement("div",{className:"pa2 tc"},n.createElement("a",{className:"dark-blue no-underline underline-hover pointer",onClick:function(){return l.auth().signOut()}},"Sign out "+this.props.user.displayName+"?")):n.createElement("div",{className:"outline"},n.createElement(M.a,{uiConfig:P,firebaseAuth:l.auth()}))}}]),t}(n.PureComponent),F=a(279),W=a(283),B=a(284),L=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).state={single_or_avg:"single",wca_pb:void 0},a}return Object(m.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.maybe_get_wca_pb=this.maybe_get_wca_pb.bind(this),fetch("http://www.worldcubeassociation.org/api/v0/persons/"+this.props.wca_id).then(function(e){return e.json()}).then(function(t){e.maybe_get_wca_pb(t,e.state.single_or_avg)})}},{key:"componentDidUpdate",value:function(e){var t=this;this.props.event===e.event&&this.props.wca_id===e.wca_id||fetch("http://www.worldcubeassociation.org/api/v0/persons/"+this.props.wca_id).then(function(e){return e.json()}).then(function(e){t.maybe_get_wca_pb(e,t.state.single_or_avg)})}},{key:"maybe_get_wca_pb",value:function(e,t){var a=this.props.event.wca_db_str;return e.hasOwnProperty("personal_records")&&e.personal_records.hasOwnProperty(a)&&e.personal_records[a].hasOwnProperty(t)?(this.setState({wca_pb:e.personal_records[a][t].best}),!0):(this.setState({wca_pb:void 0}),!1)}},{key:"render",value:function(){var e=this;if(void 0===this.state.wca_pb)return n.createElement("div",{className:"dn db-ns outline"},n.createElement("p",{className:"tc"},"No WCA data available."));for(var t=this.props.home_times,a=[],s=0;s<t.length;s++)a.push({x:s,y:t[s]});return n.createElement("div",{className:"dn db-ns outline"},n.createElement(F.a,{height:200},n.createElement(W.a,{data:a,y0:function(){return e.state.wca_pb},style:{data:{fill:"#cccccc"}}}),n.createElement(B.a,{labels:[this.state.wca_pb],style:{data:{stroke:"#ff0000"}},y:function(){return e.state.wca_pb}})))}}]),t}(n.PureComponent),K=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).state={wca_id:a.props.wca_id},a.updateFormContent=a.updateFormContent.bind(Object(b.a)(Object(b.a)(a))),a.submitWCAId=a.submitWCAId.bind(Object(b.a)(Object(b.a)(a))),a}return Object(m.a)(t,e),Object(p.a)(t,[{key:"updateFormContent",value:function(e){this.setState({wca_id:e.target.value})}},{key:"submitWCAId",value:function(e){this.props.id_change_handler(e,this.state.wca_id)}},{key:"render",value:function(){return n.createElement("div",{className:"outline",id:"event_sel"},n.createElement("div",{className:"f5 b small-caps tc"},"Settings"),n.createElement("form",{className:"pa1 black-80",onSubmit:this.submitWCAId},n.createElement("div",{className:"measure"},n.createElement("label",{className:"f6 b db mb2"},"WCA ID"),n.createElement("input",{id:"name",className:"input-reset ba b--black-20 pa2 mb2 db w-100",type:"text",onChange:this.updateFormContent,value:this.state.wca_id}),n.createElement("input",{type:"submit",value:"Set"}))))}}]),t}(n.PureComponent),R=function(e){function t(e){var a;Object(u.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).intervalID=void 0,a.db=l.firestore();var n=l.auth().onAuthStateChanged(function(e){a.setState({user:e}),a.subscribe_to_event(a.state.current_event)});return a.state={user:null,wca_id:"",startTime:0,elapsed:0,phase:{name:"waiting"},penalty:void 0,bucket:[],scramble:"Loading scramble...",scramble_img:{__html:""},current_event:{name:"3x3x3",avg_size:5,scramble_str:"333",wca_db_str:"333"},history:{},cur_event_listeners:[],auth_listener:n,stats:{pb_single:-2,pb_single_loc:"",pb_avg:null,pb_avg_loc:null},window_width:window.innerWidth},a.handleKeyDown=a.handleKeyDown.bind(Object(b.a)(Object(b.a)(a))),a.handleKeyUp=a.handleKeyUp.bind(Object(b.a)(Object(b.a)(a))),a.handleTouchStart=a.handleTouchStart.bind(Object(b.a)(Object(b.a)(a))),a.handleTouchEnd=a.handleTouchEnd.bind(Object(b.a)(Object(b.a)(a))),a.handleWindowSizeChange=a.handleWindowSizeChange.bind(Object(b.a)(Object(b.a)(a))),a.changeEvent=a.changeEvent.bind(Object(b.a)(Object(b.a)(a))),a.changeWCAId=a.changeWCAId.bind(Object(b.a)(Object(b.a)(a))),a.loadMoreHistory=a.loadMoreHistory.bind(Object(b.a)(Object(b.a)(a))),a.toggle_last_penalty=a.toggle_last_penalty.bind(Object(b.a)(Object(b.a)(a))),a.delete_last_time=a.delete_last_time.bind(Object(b.a)(Object(b.a)(a))),a.delete_avg=a.delete_avg.bind(Object(b.a)(Object(b.a)(a))),a.inspect_avg=a.inspect_avg.bind(Object(b.a)(Object(b.a)(a))),a.uninspect_avg=a.uninspect_avg.bind(Object(b.a)(Object(b.a)(a))),a.intervalID=0,a}return Object(m.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.intervalID=window.setInterval(function(){return e.tick()},1),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp),document.addEventListener("touchstart",this.handleTouchStart),document.addEventListener("touchend",this.handleTouchEnd),window.addEventListener("resize",this.handleWindowSizeChange)}},{key:"componentWillUnmount",value:function(){window.clearInterval(this.intervalID),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("resize",this.handleWindowSizeChange);var e=!0,t=!1,a=void 0;try{for(var n,s=this.state.cur_event_listeners[Symbol.iterator]();!(e=(n=s.next()).done);e=!0){(0,n.value)()}}catch(r){t=!0,a=r}finally{try{e||null==s.return||s.return()}finally{if(t)throw a}}this.state.auth_listener()}},{key:"subscribe_to_event",value:function(e){var t=this;this.setState({scramble:getScramble(e.scramble_str)});var a=!0,n=!1,s=void 0;try{for(var r,i=this.state.cur_event_listeners[Symbol.iterator]();!(a=(r=i.next()).done);a=!0){(0,r.value)()}}catch(p){n=!0,s=p}finally{try{a||null==i.return||i.return()}finally{if(n)throw s}}if(null!==this.state.user){var c=this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(e.wca_db_str),l=c.collection("Avgs").orderBy("timestamp","desc").limit(25).onSnapshot(function(e){var a=e.docs.map(function(e){return e.data()}),n=e.docs.map(function(e){return e.id}),s={};n.forEach(function(e,t){return s[e]=a[t]}),t.setState({history:s,last_hist_doc:e.docs[e.docs.length-1]})}),u=c.onSnapshot(function(e){var a=[];void 0!==e.get("bucket")&&(a=e.get("bucket").map(w)),t.setState({bucket:a})});this.setState(function(e,t){return Object(o.a)({},e,{cur_event_listeners:[u,l]})});c.onSnapshot(function(e){var a=e.get("stats");void 0===a?t.setState({stats:{pb_single:-2,pb_single_loc:"",pb_avg:null,pb_avg_loc:null}}):t.setState({stats:{pb_single:void 0===a.pb_single?-2:a.pb_single,pb_single_loc:void 0===a.pb_single_loc?"":a.pb_single_loc,pb_avg:void 0===a.pb_avg?null:a.pb_avg,pb_avg_loc:void 0===a.pb_avg_loc?null:a.pb_avg_loc}})})}}},{key:"loadMoreHistory",value:function(){var e=this;null!==this.state.user?this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str).collection("Avgs").orderBy("timestamp","desc").limit(25).startAfter(this.state.last_hist_doc).get().then(function(t){if(0!==t.docs.length){var a=t.docs.map(function(e){return e.data()}),n=t.docs.map(function(e){return e.id}),s={};n.forEach(function(e,t){return s[e]=a[t]}),e.setState(function(e,a){return{history:Object.assign({},e.history,s),last_hist_doc:t.docs[t.docs.length-1]}})}}):alert("Error (loadMoreHistory): User is null")}},{key:"saveTimeToDB",value:function(e){if(null===this.state.user)alert("Error (saveTimeToDB): User is null");else{var t=this.state.bucket.length===this.state.current_event.avg_size,a=(t?[e]:this.state.bucket.concat([e])).map(f),n=this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str),s=y(e),r=this.state.stats.pb_single,i=this.state.stats.pb_single_loc,c=this.state.stats.pb_avg;this.state.stats.pb_avg_loc;if(t){var o=function(e){var t=e.slice(0).sort(O).map(y),a=t.length;console.assert(5===a||3===a);var n=t[0],s=t[a-1],r=-1;return 5===a&&-1!==t[3]?r=(t[1]+t[2]+t[3])/3:3===a&&-1!==t[2]&&(r=(t[0]+t[1]+t[2])/3),{times:e.map(y),best:n,worst:s,avg:Math.floor(r),timestamp:l.firestore.Timestamp.now()}}(this.state.bucket);n.collection("Avgs").add(o).then(function(e){"bucket"===i&&j(r,s)&&n.set({stats:{pb_single_loc:e.id}},{merge:!0}),(null===c||j(o.avg,c))&&n.set({stats:{pb_avg:o.avg,pb_avg_loc:e.id}},{merge:!0})})}(-2===r||j(s,r))&&n.set({stats:{pb_single:s,pb_single_loc:"bucket"}},{merge:!0}),n.set({bucket:a},{merge:!0})}}},{key:"toggle_last_penalty",value:function(e){var t=this;if(null===this.state.user)alert("Error (toggle_last_penalty): User is null");else{var a=this.state.bucket.slice(),n=a.pop();if(void 0===n)return void console.error("Tried to toggle penalty with no previous solve");var s=e===n.pen?{raw:n.raw,pen:void 0}:{raw:n.raw,pen:e},r=a.concat([s]),i=r.map(f);this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str).set({bucket:i},{merge:!0}).then(function(){t.recompute_pb_single(r)})}}},{key:"recompute_pb_single",value:function(e){if(null===this.state.user)alert("Error (recompute_pb_single): User is null");else{var t=-2;if(0!==e.length){t=-1;var a=!0,n=!1,s=void 0;try{for(var r,i=e.map(y)[Symbol.iterator]();!(a=(r=i.next()).done);a=!0){var c=r.value;j(c,t)&&(t=c)}}catch(o){n=!0,s=o}finally{try{a||null==i.return||i.return()}finally{if(n)throw s}}}var l=this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str);l.collection("Avgs").orderBy("best","asc").limit(1).get().then(function(e){if(0===e.docs.length)l.set({stats:{pb_single:t,pb_single_loc:"bucket"}},{merge:!0});else if(-2===t){var a=e.docs[0].data().best;l.set({stats:{pb_single:a,pb_single_loc:e.docs[0].id}},{merge:!0})}else{var n=e.docs[0].data().best;l.set(j(t,n)?{stats:{pb_single:t,pb_single_loc:"bucket"}}:{stats:{pb_single:n,pb_single_loc:e.docs[0].id}},{merge:!0})}})}}},{key:"recompute_pb_avg",value:function(){if(null===this.state.user)alert("Error (recompute_pb_avg): User is null");else{var e=this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str);e.collection("Avgs").orderBy("avg","asc").limit(1).get().then(function(t){if(0===t.docs.length)e.set({stats:{pb_avg:null,pb_avg_loc:null}},{merge:!0});else{var a=t.docs[0].data();e.set({stats:{pb_avg:a.avg,pb_avg_loc:t.docs[0].id}},{merge:!0})}})}}},{key:"delete_last_time",value:function(){if(null===this.state.user)alert("Error (delete_last_time): User is null");else{var e=this.state.bucket.slice(),t=e.pop();this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str).set({bucket:e.map(f)},{merge:!0}),y(t)===this.state.stats.pb_single&&this.recompute_pb_single(e)}}},{key:"delete_avg",value:function(e){var t=this;null===this.state.user?alert("Error (delete_avg): User is null"):this.db.collection("Users").doc(this.state.user.uid).collection("Events").doc(this.state.current_event.wca_db_str).collection("Avgs").doc(e).delete().then(function(){e===t.state.stats.pb_single_loc&&t.recompute_pb_single(t.state.bucket),e===t.state.stats.pb_avg_loc&&t.recompute_pb_avg()})}},{key:"handleTouchStart",value:function(e){var t=this;this.setState(function(e,a){var n;switch(e.phase.name){case"inspecting":n=Object(o.a)({},e,{phase:{name:"red",timeTurnedRed:Date.now()}});break;case"running":var s={raw:Math.floor(e.elapsed/10),pen:e.penalty};n=Object(o.a)({},e,{phase:{name:"stopped"},scramble:getScramble(e.current_event.scramble_str)}),t.saveTimeToDB(s);break;default:n=Object(o.a)({},e)}return n})}},{key:"handleTouchEnd",value:function(e){this.setState(function(t,a){var n;switch(t.phase.name){case"waiting":n=e.target===document.getElementById("timer_main")||e.target===document.getElementById("timer_text")?Object(o.a)({},t,{startTime:Date.now(),phase:{name:"inspecting"}}):t;break;case"red":n=Object(o.a)({},t,{phase:{name:"inspecting"}});break;case"green":n=Object(o.a)({},t,{startTime:Date.now(),elapsed:0,phase:{name:"running"}});break;case"stopped":n=Object(o.a)({},t,{phase:{name:"waiting"}});break;default:n=Object(o.a)({},t)}return n})}},{key:"handleKeyDown",value:function(e){var t=this;this.setState(function(a,n){var s;switch(a.phase.name){case"inspecting":s="Space"===e.code?Object(o.a)({},a,{phase:{name:"red",timeTurnedRed:Date.now()}}):Object(o.a)({},a);break;case"running":var r={raw:Math.floor(a.elapsed/10),pen:a.penalty};s=Object(o.a)({},a,{phase:{name:"stopped"},scramble:getScramble(a.current_event.scramble_str)}),t.saveTimeToDB(r);break;default:s=Object(o.a)({},a)}return s})}},{key:"handleKeyUp",value:function(e){this.setState(function(t,a){var n;switch(t.phase.name){case"waiting":n="Space"===e.code?Object(o.a)({},t,{startTime:Date.now(),phase:{name:"inspecting"}}):Object(o.a)({},t);break;case"red":n="Space"===e.code?Object(o.a)({},t,{phase:{name:"inspecting"}}):Object(o.a)({},t);break;case"green":n="Space"===e.code?Object(o.a)({},t,{startTime:Date.now(),elapsed:0,phase:{name:"running"}}):Object(o.a)({},t);break;case"stopped":n=Object(o.a)({},t,{phase:{name:"waiting"}});break;default:n=Object(o.a)({},t)}return n})}},{key:"tick",value:function(){this.setState(function(e,t){var a;switch(e.phase.name){case"red":a=v(e.phase.timeTurnedRed)>=550?Object(o.a)({},e,{elapsed:v(e.startTime),phase:{name:"green"},penalty:S(e.elapsed)}):Object(o.a)({},e,{elapsed:v(e.startTime),penalty:S(e.elapsed)});break;case"inspecting":case"green":a=Object(o.a)({},e,{elapsed:v(e.startTime),penalty:S(e.elapsed)});break;case"running":a=Object(o.a)({},e,{elapsed:v(e.startTime)});break;default:a=e}return a})}},{key:"changeEvent",value:function(e){!e||e instanceof Array?console.log("Invalid input to event select handler."):(this.setState({current_event:e}),this.subscribe_to_event(e))}},{key:"changeWCAId",value:function(e,t){this.setState({wca_id:t}),e.preventDefault()}},{key:"all_times_raw_array",value:function(){var e=this.state.bucket.map(function(e){return y(e)});return Object.values(this.state.history).sort(function(e,t){var a=e.timestamp.toDate(),n=t.timestamp.toDate();return a<n?1:a>n?-1:0}).flatMap(function(e){return e.times}).concat(e)}},{key:"inspect_avg",value:function(e){this.setState({inspect_avg:e})}},{key:"uninspect_avg",value:function(){this.setState({inspect_avg:void 0})}},{key:"handleWindowSizeChange",value:function(){this.setState({window_width:window.innerWidth})}},{key:"render",value:function(){return this.state.window_width<=500?n.createElement("section",{className:"flex flex-column justify-between w-100 vh-100"},n.createElement("div",{className:"w-100 outline"},n.createElement(A,{onChange:this.changeEvent,isDisabled:"waiting"!==this.state.phase.name}),n.createElement(E,{scramble:this.state.scramble,event:this.state.current_event})),n.createElement("div",{id:"timer_main",className:"vh-100 noselect"},n.createElement(C,{ms:this.state.elapsed,phase:this.state.phase,pen:this.state.penalty})),n.createElement("div",{className:"w-100 outline"},n.createElement(k,{times:this.state.bucket,edit_fn:this.toggle_last_penalty,delete_fn:this.delete_last_time,avg_size:this.state.current_event.avg_size})," ",n.createElement(U,{user:this.state.user}))):n.createElement("section",{className:"flex items-start justify-between w-100 overflow-hidden vh-100"},n.createElement("div",{className:"flex flex-column vh-100 justify-between w-25 outline"},n.createElement("div",{className:"outline"},n.createElement(A,{onChange:this.changeEvent,isDisabled:"waiting"!==this.state.phase.name}),n.createElement(N,{event:this.state.current_event,stats:this.state.stats,inspect_func:this.inspect_avg})),n.createElement(x,{hist:this.state.history,load_more_func:this.loadMoreHistory,inspect_func:this.inspect_avg})),n.createElement("div",{className:"flex flex-column justify-between vh-100 w-50 outline"},void 0===this.state.inspect_avg?n.createElement(n.Fragment,null,n.createElement(E,{scramble:this.state.scramble,event:this.state.current_event}),n.createElement(C,{ms:this.state.elapsed,phase:this.state.phase,pen:this.state.penalty}),n.createElement("div",null,n.createElement(k,{times:this.state.bucket,edit_fn:this.toggle_last_penalty,delete_fn:this.delete_last_time,avg_size:this.state.current_event.avg_size}),n.createElement(L,{event:this.state.current_event,wca_id:this.state.wca_id,home_times:this.all_times_raw_array()}))):n.createElement(n.Fragment,null,n.createElement(T,{avg_id:this.state.inspect_avg,avg_json:this.state.history[this.state.inspect_avg],delete_func:this.delete_avg,close_func:this.uninspect_avg}))),n.createElement("div",{className:"flex flex-column-reverse vh-100 justify-between w-25 outline"},n.createElement("div",null,n.createElement(K,{wca_id:this.state.wca_id,id_change_handler:this.changeWCAId}),n.createElement(U,{user:this.state.user}))))}}]),t}(n.PureComponent);l.initializeApp({apiKey:"AIzaSyDwiz-hIBeojGWqnk6rE7Ao3b7LS9-Wg6g",authDomain:"timer-v0.firebaseapp.com",databaseURL:"https://timer-v0.firebaseio.com",projectId:"timer-v0",storageBucket:"timer-v0.appspot.com",messagingSenderId:"998055254824",appId:"1:998055254824:web:3149843957307226"}),i.a.render(s.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[148,2,1]]]);
//# sourceMappingURL=main.ff305376.chunk.js.map