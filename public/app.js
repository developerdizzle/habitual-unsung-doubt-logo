(function($, _) {
    $(function() {
        var $team = $('#team');

        var $firstName = $('#firstName');
        var $title = $('#title');

        // filtering
        
        var filter = function() {
            var $members = $team.find('.member');
            
            $members.each(function() {
                var $member = $(this);

                var shouldShow = true;
                
                if (shouldShow && $firstName.val() && $firstName.val() !== $member.data('firstName')) {
                    shouldShow = false;
                }
                
                if (shouldShow && $title.val() && $title.val() !== $member.data('title')) {
                    shouldShow = false;
                }
                
                $member.toggle(shouldShow);
            });

        };
        
        $firstName.on('change', filter);
        $title.on('change', filter);
        
        // get our grouped data into [{ key, count }] form
        
        var mapAndSort = function(items) {
            return Object.keys(items).map(function(key) {
                return {
                    key: key,
                    count: items[key].length
                };
            }).sort(function(a, b) {
                return b.count - a.count;
            });
        };

        // populate team members        
        
        var html = $('#member-template').html();
        var template = _.template(html);
        
        $.getJSON('/team.json', function(members) {
            $.each(members, function(i, member) {
                var $member = template(member);
                
                $team.append($member);
            });
            
            // first names
            
            $firstName.empty();
            $firstName.append('<option value="">All</option>');
            
            var groupedNames = _.groupBy(members, function(member) {
                return member.name.split(' ')[0];
            });
            
            var firstNames = mapAndSort(groupedNames);
            
            firstNames.forEach(function(item) {
                $firstName.append('<option value="' + item.key + '">' + item.key + '(' + item.count + ')' + '</option>');
            });
            
            // titles

            $title.empty();
            $title.append('<option value="">All</option>');
            
            var groupedTitles = _.groupBy(members, function(member) {
                return member.title;
            });
            
            var titles = mapAndSort(groupedTitles);
            
            titles.forEach(function(item) {
                $title.append('<option value="' + item.key + '">' + item.key + '(' + item.count + ')' + '</option>');
            });
        });
    });
})(window.jQuery, window._);