#!/usr/bin/env bash
set -uo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

DIRS=(
  01-counter
  02-greeter
  03-logic-sig-gate
  04-type-explorer
  05-membership-registry
  06-key-value-store
  07-array-playground
  08-object-tuples
  09-token-manager
  10-multi-txn-distributor
  11-contract-factory
  12-event-logger
  13-inheritance-showcase
  14-crypto-vault
  15-dex-pool
  16-governance-dao
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

passed=0
failed=0
failures=()

echo -e "${BOLD}Running all ${#DIRS[@]} examples...${NC}"
echo ""

for dir in "${DIRS[@]}"; do
  printf "  %-40s " "$dir"
  if npm run example -- "$dir" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
    ((passed++))
  else
    echo -e "${RED}FAIL${NC}"
    ((failed++))
    failures+=("$dir")
  fi
done

echo ""
echo -e "${BOLD}Summary: ${GREEN}${passed} passed${NC}, ${RED}${failed} failed${NC} out of ${#DIRS[@]}"

if [ ${#failures[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}Failed examples:${NC}"
  for f in "${failures[@]}"; do
    echo "  - $f"
  done
  echo ""
  echo "Tip: Reset LocalNet with 'algokit localnet reset' and retry."
fi

exit "$failed"
