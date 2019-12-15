import React, { createContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import Permissions from "react-native-permissions";

interface PermissionsState {
    canReadFiles: boolean;
}

interface PermissionsData {
    state: PermissionsState
    setState: (state: Partial<PermissionsState>) => void;
}

const PermissionsContext = createContext<PermissionsData>({
    state: {
        canReadFiles: false
    },
    setState: () => {
        // filled in by provider
    }
});

const PermissionsContextComponent: React.FC = props => {
    const [state, setState] = useState<PermissionsState>({ canReadFiles: false });

    async function requestFilePermissions() {
        const canAccessFiles = await Permissions.request("android.permission.READ_EXTERNAL_STORAGE", {
            title: "Access files",
            message: "Allow this app to access files?",
            buttonPositive: "Yes",
            buttonNegative: "No"
        });
        if (canAccessFiles === "granted") {
            updatePermissions({ canReadFiles: true });
        }
    }

    useEffect(() => {
        requestFilePermissions();
    }, []);

    function updatePermissions(permissions: Partial<PermissionsState>) {
        setState(permissions as PermissionsState);
        throw new Error(JSON.stringify(permissions))
    }

    return (
        <PermissionsContext.Provider value={{ state, setState: updatePermissions }}>{props.children}</PermissionsContext.Provider>
    )
}

export default PermissionsContextComponent;
export { PermissionsContext };