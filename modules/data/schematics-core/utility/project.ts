import { getWorkspace, WorkspaceSchema } from './config';
import { Tree } from '@angular-devkit/schematics';

export interface WorkspaceProject {
  root: string;
  projectType: string;
}

function getProjectName(
  workspace: WorkspaceSchema,
  options: { project?: string | undefined; path?: string | undefined }
): string {
  if (!options.project) {
    options.project =
      workspace.defaultProject !== undefined
        ? workspace.defaultProject
        : Object.keys(workspace.projects)[0];
  }

  return options.project;
}

export function getProject(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): WorkspaceProject {
  const workspace = getWorkspace(host);
  const projectName = getProjectName(workspace, options);
  const project = workspace.projects[projectName];

  if (!project) {
    throw new Error(
      `Project ${projectName} does not exist. Please provide a valid project.`
    );
  }

  return project;
}

export function getProjectPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  if (project.root.substr(-1) === '/') {
    project.root = project.root.substr(0, project.root.length - 1);
  }

  if (options.path === undefined) {
    const projectDirName =
      project.projectType === 'application' ? 'app' : 'lib';

    return `${project.root ? `/${project.root}` : ''}/src/${projectDirName}`;
  }

  return options.path;
}

export function isLib(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  return project.projectType === 'library';
}
