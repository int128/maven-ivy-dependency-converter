/*
 * (c) hidetake.org, 2012.
 */
$(function () {
	var rules = [
		{pom: 'groupId', ivy: 'org'},
		{pom: 'artifactId', ivy: 'name'},
		{pom: 'version', ivy: 'rev'},
		{pom: 'scope', ivy: 'conf',
			pom2ivy: function (dependency) {
				$(dependency).attr('conf', $(dependency).children('scope').text() + '->default');
			},
			ivy2pom: function (dependency) {
				$(dependency).append($(document.createElement('scope')).text(
					$(dependency).attr('conf').replace(/(.+?)->.+/, '$1')));
			}},
	];
	var workbox = $('<div style="display: none;"/>').appendTo(this);
	$('textarea[name="pom"]').change(function () {
		$(workbox).html($(this).val());
		$('dependency', workbox).each(function (i, dependency) {
			$.each(rules, function (j, rule) {
				if ($.isFunction(rule.pom2ivy)) {
					rule.pom2ivy(dependency);
				} else {
					$(dependency).attr(rule.ivy, $(dependency).children(rule.pom).text());
				}
			});
			$(dependency).empty();
		});
		$('textarea[name="ivy"]').text($(workbox).html()).keyup();
		$(workbox).empty();
	});
	$('textarea[name="ivy"]').change(function () {
		$(workbox).html($(this).val());
		$('dependency', workbox).each(function (i, dependency) {
			$(dependency).append('\n');
			$.each(rules, function (j, rule) {
				if ($.isFunction(rule.ivy2pom)) {
					rule.ivy2pom(dependency);
				} else {
					$(dependency).append($(document.createElement(rule.pom)).text($(dependency).attr(rule.ivy)));
					$(dependency).append('\n');
				}
				$(dependency).removeAttr(rule.ivy);
			});
			$(dependency).append('\n');
		});
		$('textarea[name="pom"]').text($(workbox).html()).keyup();
		$(workbox).empty();
	});
});