#!/usr/bin/env bash
set -uo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

DIRS=(
  01-counter
  02-greeter
  03-raw-calculator
  04-logic-sig-gate
  05-type-explorer
  06-membership-registry
  07-arc4-data-structures
  08-key-value-store
  09-array-playground
  10-object-tuples
  11-token-manager
  12-multi-txn-distributor
  13-contract-factory
  14-event-logger
  15-inheritance-showcase
  16-crypto-vault
  17-dex-pool
  18-governance-dao
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
