import type {
  ToolConfig,
  ToolRegistryEntry,
  BaseDocumentToolProps,
  ToolFunction,
} from './types';
import { executeToolFunction } from './actions';

// helper to wrap existing tools into registry format
export function wrapTool(
  toolFn: ToolFunction | null,
  config: ToolConfig,
): ToolRegistryEntry {
  return {
    toolFn:
      toolFn ??
      ((props?: BaseDocumentToolProps) =>
        executeToolFunction(config.name, props)),
    config,
  };
}
