#!/bin/bash

# Ansible playbooks mapping and inputs
declare -A playbooks
playbooks=(
    [1]="playbook1.yml # Description for playbook 1"
    [2]="playbook2.yml # Description for playbook 2"
    [3]="playbook3.yml # Description for playbook 3"
)

# Predefined inputs for playbooks
declare -A playbook_inputs
playbook_inputs=(
    [1]="-e var1=value1 -e var2=value2"
    [2]="-e var3=value3 -e var4=value4"
    [3]="-e var5=value5 -e var6=value6"
)

# Function to display help
function display_help() {
    echo "Usage: $0 [step_number]"
    echo
    echo "Run Ansible playbooks based on the step number provided."
    echo
    echo "Options:"
    echo "  -h, --help      Display this help message"
    echo
    echo "Steps:"
    for step in "${!playbooks[@]}"; do
        echo "  $step       ${playbooks[$step]}"
    done
}

# Function to run playbook
function run_playbook() {
    step=$1
    playbook=${playbooks[$step]%% #*}
    description=${playbooks[$step]#*# }
    inputs=${playbook_inputs[$step]}
    echo "Running Step $step: $description"
    echo "Command: ansible-playbook $playbook $inputs"
    ansible-playbook "$playbook" $inputs
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    display_help
    exit 0
fi

# Run playbooks based on input
if [ -n "$1" ]; then
    if [[ -n "${playbooks[$1]}" ]]; then
        run_playbook "$1"
    else
        echo "Error: Invalid step number."
        display_help
        exit 1
    fi
else
    for step in "${!playbooks[@]}"; do
        run_playbook "$step"
    done
fi