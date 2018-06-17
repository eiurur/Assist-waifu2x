import ContextMenuExtensionListener from './listener/ContextMenuExtensionListener';
import RuntimeMessageListener from './listener/RuntimeMessageListener';

[new ContextMenuExtensionListener(), new RuntimeMessageListener()].map(
  listener => listener.activate(),
);
