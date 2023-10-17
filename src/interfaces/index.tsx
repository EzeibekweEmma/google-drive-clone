interface Button {
  btnClass: string;
  btnText: string;
  onClick?: () => void;
}

interface GithubAuth {
  clientId: string;
  clientSecret: string;
}

interface UserInfoProps {
  setDisplayUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface folderToggleProps {
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setFolderName: React.Dispatch<React.SetStateAction<string>>;
  uploadFolder: Function;
}

interface folderToggleAndUpload {
  uploadFile: Function;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProgressIndicatorProps {
  progress: number[];
  fileName: string[];
  setFileName: React.Dispatch<React.SetStateAction<string[]>>;
}

interface FileListProps {
  folderName: string;
  isFolder: boolean;
  id: string;
  fileLink: string;
  fileName: string;
  fileExtension: string;
}

interface payloadProps {
  folderName: string;
  isFolder: boolean;
  FileList: object;
}
