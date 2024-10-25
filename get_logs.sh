#!/bin/bash

# Définition des couleurs ANSI
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"

# Vérifie si au moins un argument est passé (nom du conteneur)
if [ $# -eq 0 ]; then
    echo -e "${RED}Erreur: Aucun conteneur spécifié.${RESET}"
    echo "Utilisation: $0 [nom_du_conteneur ...]"
    exit 1
fi

# Fonction pour afficher les logs et vérifier leur état
check_logs() {
    container_name="$1"

    echo "=== Logs du conteneur: $container_name ==="

    # Récupère les logs du conteneur
    logs=$(docker logs "$container_name" 2>&1)
    echo "$logs"  # Affiche les logs

    # Vérifie si le conteneur est en fonctionnement
    if docker inspect -f '{{.State.Running}}' "$container_name" | grep true > /dev/null; then
        # Vérification des erreurs dans les logs
        if echo "$logs" | grep -i "error\|failed\|exception" > /dev/null; then
            # Si des erreurs sont trouvées, affiche KO en rouge avec la première erreur
            problem=$(echo "$logs" | grep -i "error\|failed\|exception" | head -n 1)
            echo -e "${RED}KO${RESET} (${YELLOW}${problem}${RESET})"
        else
            # Si tout va bien, affiche OK en vert
            echo -e "${GREEN}OK${RESET}"
        fi
    else
        # Si le conteneur n'est pas en marche, affiche KO avec un message d'arrêt
        echo -e "${RED}KO${RESET} (${YELLOW}Le conteneur est arrêté${RESET})"
    fi

    echo "=============================="
}

# Parcourt tous les conteneurs spécifiés en arguments et affiche leurs logs
for container in "$@"; do
    check_logs "$container"
done

