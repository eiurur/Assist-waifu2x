// minimum tasks
require('./gulp/tasks/clean');
require('./gulp/tasks/vendor_css');
require('./gulp/tasks/vendor_js');
require('./gulp/tasks/images');
require('./gulp/tasks/manifest');
require('./gulp/tasks/webpack');
require('./gulp/tasks/update_manifest_version');
require('./gulp/tasks/sass');
require('./gulp/tasks/popup_css');
require('./gulp/tasks/pug');

// wrapped up
require('./gulp/tasks/build');

// packaging
require('./gulp/tasks/watch');
require('./gulp/tasks/zip');
require('./gulp/tasks/default');
