import { workspaces } from '@angular-devkit/core';
import { getWorkspace } from './config';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

export interface WorkspaceProject {
  root: string;
  projectType: string;
  architect: {
    [key: string]: workspaces.TargetDefinition;
  };
}

export function getProject(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
): WorkspaceProject {
  const workspace = getWorkspace(host);

  if (!options.project) {
    const defaultProject = (workspace as { defaultProject?: string })
      .defaultProject;
    options.project =
      defaultProject !== undefined
        ? defaultProject
        : Object.keys(workspace.projects)[0];
  }

  return workspace.projects[options.project];
}

export function getProjectPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  if (project.root.slice(-1) === '/') {
    project.root = project.root.substring(0, project.root.length - 1);
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

export function getProjectMainFile(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  if (isLib(host, options)) {
    throw new SchematicsException(`Invalid project type`);
  }
  const project = getProject(host, options);
  const projectOptions = project.architect['build'].options;

  if (!projectOptions?.main && !projectOptions?.browser) {
    throw new SchematicsException(`Could not find the main file ${project}`);
  }

  return (projectOptions.browser || projectOptions.main) as string;
}
