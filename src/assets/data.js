module.exports = function (keyword) {
  var _matched = []
  if (keyword) {
    var i = Math.round(Math.random() * 10)
    if (i < 2 || i > 7) {
      i = 0
    }
    for (var j = 0; j < i; j++) {
      _matched.push({
        'userId': '200000' + j,
        'userName': keyword + '_0' + j,
        'ico': 'fa fa-user',
        'avatarUrl': 'http://workin.me/static/img/a2.jpg'
      })
    }
  } else {
    _matched = [{
      'userId': '1013601',
      'userName': '张守义',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a2.jpg'
    }, {
      'userId': '1013602',
      'userName': '张国良',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a1.jpg'
    }, {
      'userId': '1013703',
      'userName': '张士诚',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a3.jpg'
    }]
  }
  // console.log(_matched)
  return {
    matched: _matched,
    recommandUser: [{
      'userId': '1013501',
      'userName': '张三',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a2.jpg'
    }, {
      'userId': '1013502',
      'userName': '李四',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a1.jpg'
    }, {
      'userId': '1013503',
      'userName': '王五',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a3.jpg'
    }],
    defUser: [{
      'userId': '1013601',
      'userName': '当前用户',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a2.jpg'
    }, {
      'userId': 'null',
      'userName': '未分配用户',
      'ico': 'fa fa-user',
      'avatarUrl': 'http://workin.me/static/img/a1.jpg'
    }],
    recommandGroup: [{
      'userId': '1011',
      'userName': '测试组',
      'ico': 'fa fa-users',
      'avatarUrl': 'http://workin.me/static/img/a2.jpg'
    }, {
      'userId': '1002',
      'userName': '运维组',
      'ico': 'fa fa-users',
      'avatarUrl': 'http://workin.me/static/img/a1.jpg'
    }, {
      'userId': '1503',
      'userName': '研发组',
      'ico': 'fa fa-users',
      'avatarUrl': 'http://workin.me/static/img/a3.jpg'
    }]
  }
}
