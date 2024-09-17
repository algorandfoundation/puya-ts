import algopy
from algopy import (
    Account,
    Application,
    ARC4Contract,
    Asset,
    Bytes,
    Global,
    GlobalState,
    LocalState,
    Txn,
    UInt64,
    arc4,
    op,
    subroutine,
)


@subroutine
def _get_1st_ref_index() -> UInt64:
    return op.btoi(Txn.application_args(1))


class StateAcctParamsGetContract(ARC4Contract):
    @arc4.abimethod()
    def verify_acct_balance(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_balance(a)
        value_index, funded_index = op.AcctParamsGet.acct_balance(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        assert value == a.balance, "expected Account balance to match"
        assert value == algopy.op.balance(a), "expected op.balance to match"
        assert value == algopy.op.balance(
            _get_1st_ref_index()
        ), "expected op.balance by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_min_balance(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_min_balance(a)
        value_index, funded_index = op.AcctParamsGet.acct_min_balance(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        assert value == a.min_balance, "expected Account min_balance to match"
        assert value == algopy.op.min_balance(a), "expected op.min_balance to match"
        assert value == algopy.op.min_balance(
            _get_1st_ref_index()
        ), "expected op.min_balance by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_auth_addr(self, a: algopy.Account) -> arc4.Address:
        value, funded = op.AcctParamsGet.acct_auth_addr(a)
        value_index, funded_index = op.AcctParamsGet.acct_auth_addr(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_acct_total_num_uint(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_num_uint(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_num_uint(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_num_byte_slice(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_num_byte_slice(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_num_byte_slice(
            _get_1st_ref_index()
        )
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_extra_app_pages(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_extra_app_pages(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_extra_app_pages(
            _get_1st_ref_index()
        )
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_apps_created(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_apps_created(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_apps_created(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_apps_opted_in(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_apps_opted_in(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_apps_opted_in(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_assets_created(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_assets_created(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_assets_created(
            _get_1st_ref_index()
        )
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_assets(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_assets(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_assets(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_boxes(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_boxes(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_boxes(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value

    @arc4.abimethod()
    def verify_acct_total_box_bytes(self, a: algopy.Account) -> algopy.UInt64:
        value, funded = op.AcctParamsGet.acct_total_box_bytes(a)
        value_index, funded_index = op.AcctParamsGet.acct_total_box_bytes(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert funded == funded_index, "expected funded by index to match"
        return value


class StateAssetHoldingContract(ARC4Contract):
    @arc4.abimethod()
    def verify_asset_holding_get(self, a: Account, b: Asset) -> UInt64:
        balance, _val = op.AssetHoldingGet.asset_balance(a, b)
        return balance

    @arc4.abimethod()
    def verify_asset_frozen_get(self, a: Account, b: Asset) -> bool:
        frozen, _val = op.AssetHoldingGet.asset_frozen(a, b)
        return frozen


class StateAssetParamsContract(ARC4Contract):
    @arc4.abimethod()
    def verify_asset_params_get_total(self, a: Asset) -> UInt64:
        value, exists = op.AssetParamsGet.asset_total(a)
        value_index, exists_index = op.AssetParamsGet.asset_total(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_decimals(self, a: Asset) -> UInt64:
        value, exists = op.AssetParamsGet.asset_decimals(a)
        value_index, exists_index = op.AssetParamsGet.asset_decimals(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_default_frozen(self, a: Asset) -> bool:
        value, exists = op.AssetParamsGet.asset_default_frozen(a)
        value_index, exists_index = op.AssetParamsGet.asset_default_frozen(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_unit_name(self, a: Asset) -> Bytes:
        value, exists = op.AssetParamsGet.asset_unit_name(a)
        value_index, exists_index = op.AssetParamsGet.asset_unit_name(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_name(self, a: Asset) -> Bytes:
        value, exists = op.AssetParamsGet.asset_name(a)
        value_index, exists_index = op.AssetParamsGet.asset_name(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_url(self, a: Asset) -> Bytes:
        value, exists = op.AssetParamsGet.asset_url(a)
        value_index, exists_index = op.AssetParamsGet.asset_url(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_metadata_hash(self, a: Asset) -> Bytes:
        value, exists = op.AssetParamsGet.asset_metadata_hash(a)
        value_index, exists_index = op.AssetParamsGet.asset_metadata_hash(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_asset_params_get_manager(self, a: Asset) -> arc4.Address:
        value, exists = op.AssetParamsGet.asset_manager(a)
        value_index, exists_index = op.AssetParamsGet.asset_manager(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_asset_params_get_reserve(self, a: Asset) -> arc4.Address:
        value, exists = op.AssetParamsGet.asset_reserve(a)
        value_index, exists_index = op.AssetParamsGet.asset_reserve(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_asset_params_get_freeze(self, a: Asset) -> arc4.Address:
        value, exists = op.AssetParamsGet.asset_freeze(a)
        value_index, exists_index = op.AssetParamsGet.asset_freeze(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_asset_params_get_clawback(self, a: Asset) -> arc4.Address:
        value, exists = op.AssetParamsGet.asset_clawback(a)
        value_index, exists_index = op.AssetParamsGet.asset_clawback(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_asset_params_get_creator(self, a: Asset) -> arc4.Address:
        value, exists = op.AssetParamsGet.asset_creator(a)
        value_index, exists_index = op.AssetParamsGet.asset_creator(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)


class StateAppParamsContract(ARC4Contract):

    @arc4.abimethod()
    def verify_app_params_get_approval_program(self, a: Application) -> Bytes:
        value, exists = op.AppParamsGet.app_approval_program(a)
        value_index, exists_index = op.AppParamsGet.app_approval_program(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_clear_state_program(self, a: Application) -> Bytes:
        value, exists = op.AppParamsGet.app_clear_state_program(a)
        value_index, exists_index = op.AppParamsGet.app_clear_state_program(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_global_num_uint(self, a: Application) -> UInt64:
        value, exists = op.AppParamsGet.app_global_num_uint(a)
        value_index, exists_index = op.AppParamsGet.app_global_num_uint(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_global_num_byte_slice(self, a: Application) -> UInt64:
        value, exists = op.AppParamsGet.app_global_num_byte_slice(a)
        value_index, exists_index = op.AppParamsGet.app_global_num_byte_slice(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_local_num_uint(self, a: Application) -> UInt64:
        value, exists = op.AppParamsGet.app_local_num_uint(a)
        value_index, exists_index = op.AppParamsGet.app_local_num_uint(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_local_num_byte_slice(self, a: Application) -> UInt64:
        value, exists = op.AppParamsGet.app_local_num_byte_slice(a)
        value_index, exists_index = op.AppParamsGet.app_local_num_byte_slice(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_extra_program_pages(self, a: Application) -> UInt64:
        value, exists = op.AppParamsGet.app_extra_program_pages(a)
        value_index, exists_index = op.AppParamsGet.app_extra_program_pages(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return value

    @arc4.abimethod()
    def verify_app_params_get_creator(self, a: Application) -> arc4.Address:
        value, exists = op.AppParamsGet.app_creator(a)
        value_index, exists_index = op.AppParamsGet.app_creator(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)

    @arc4.abimethod()
    def verify_app_params_get_address(self, a: Application) -> arc4.Address:
        value, exists = op.AppParamsGet.app_address(a)
        value_index, exists_index = op.AppParamsGet.app_address(_get_1st_ref_index())
        assert value == value_index, "expected value by index to match"
        assert exists == exists_index, "expected exists by index to match"
        return arc4.Address(value)


class StateAppLocalExContract(ARC4Contract):
    def __init__(self) -> None:
        self.local_uint64 = LocalState(
            UInt64,
            key="local_uint64",
        )

        self.local_bytes = LocalState(
            Bytes,
            key="local_bytes",
        )

        self.local_arc4_bytes = LocalState(
            algopy.arc4.DynamicBytes,
            key="local_arc4_bytes",
        )

    @arc4.abimethod(allow_actions=["OptIn"])
    def opt_in(self) -> None:
        self.local_bytes[Global.creator_address] = Bytes(b"dummy_bytes_from_external_contract")
        self.local_uint64[Global.creator_address] = UInt64(99)
        self.local_arc4_bytes[Global.creator_address] = algopy.arc4.DynamicBytes(
            b"dummy_arc4_bytes"
        )


class StateAppLocalContract(ARC4Contract):
    def __init__(self) -> None:
        self.local_uint64 = LocalState(
            UInt64,
            key="local_uint64",
        )

        self.local_bytes = LocalState(
            Bytes,
            key="local_bytes",
        )

    @arc4.abimethod(allow_actions=["OptIn"])
    def opt_in(self) -> None:
        self.local_bytes[Global.creator_address] = Bytes(b"dummy_bytes")
        self.local_uint64[Global.creator_address] = UInt64(999)

    @arc4.abimethod()
    def verify_get_bytes(self, a: Account, b: Bytes) -> Bytes:
        value = op.AppLocal.get_bytes(a, b)
        return value

    @arc4.abimethod()
    def verify_get_uint64(self, a: Account, b: Bytes) -> UInt64:
        value = op.AppLocal.get_uint64(a, b)
        return value

    @arc4.abimethod()
    def verify_get_ex_bytes(self, a: Account, b: Application, c: Bytes) -> Bytes:
        value, _val = op.AppLocal.get_ex_bytes(a, b, c)
        return value

    @arc4.abimethod()
    def verify_get_ex_uint64(self, a: Account, b: Application, c: Bytes) -> UInt64:
        value, _val = op.AppLocal.get_ex_uint64(a, b, c)
        return value

    @arc4.abimethod()
    def verify_delete(self, a: Account, b: Bytes) -> None:
        op.AppLocal.delete(a, b)

    @arc4.abimethod()
    def verify_exists(self, a: Account, b: Bytes) -> bool:
        _value, exists = op.AppLocal.get_ex_uint64(a, 0, b)
        return exists

    @arc4.abimethod()
    def verify_put_uint64(self, a: Account, b: Bytes, c: UInt64) -> None:
        op.AppLocal.put(a, b, c)

    @arc4.abimethod()
    def verify_put_bytes(self, a: Account, b: Bytes, c: Bytes) -> None:
        op.AppLocal.put(a, b, c)


class StateAppGlobalExContract(ARC4Contract):
    def __init__(self) -> None:
        self.global_uint64 = GlobalState(
            UInt64(2),
            key="global_uint64",
        )
        self.global_bytes = GlobalState(
            Bytes(b"dummy_bytes"),
            key="global_bytes",
        )
        self.global_uint64_explicit = algopy.UInt64(2)
        self.global_bytes_explicit = algopy.Bytes(b"dummy_bytes")
        self.global_arc4_bytes = GlobalState(
            algopy.arc4.DynamicBytes(b"dummy_arc4_bytes"), key="global_arc4_bytes"
        )
        self.global_arc4_bytes_explicit = algopy.arc4.DynamicBytes(b"dummy_arc4_bytes")


class StateAppGlobalContract(ARC4Contract):
    def __init__(self) -> None:
        self.global_uint64 = GlobalState(
            UInt64,
            key="global_uint64",
        )

        self.global_bytes = GlobalState(
            Bytes,
            key="global_bytes",
        )

    @arc4.abimethod()
    def verify_get_bytes(self, a: Bytes) -> Bytes:
        value = op.AppGlobal.get_bytes(a)
        return value

    @arc4.abimethod()
    def verify_get_uint64(self, a: Bytes) -> UInt64:
        value = op.AppGlobal.get_uint64(a)
        return value

    @arc4.abimethod()
    def verify_get_ex_bytes(self, a: Application, b: Bytes) -> tuple[Bytes, bool]:
        return op.AppGlobal.get_ex_bytes(a, b)

    @arc4.abimethod()
    def verify_get_ex_uint64(self, a: Application, b: Bytes) -> tuple[UInt64, bool]:
        return op.AppGlobal.get_ex_uint64(a, b)

    @arc4.abimethod()
    def verify_delete(self, a: Bytes) -> None:
        op.AppGlobal.delete(a)

    @arc4.abimethod()
    def verify_put_uint64(self, a: Bytes, b: UInt64) -> None:
        op.AppGlobal.put(a, b)

    @arc4.abimethod()
    def verify_put_bytes(self, a: Bytes, b: Bytes) -> None:
        op.AppGlobal.put(a, b)


class ITxnOpsContract(ARC4Contract):
    @arc4.abimethod()
    def verify_itxn_ops(self) -> None:
        algopy.op.ITxnCreate.begin()
        algopy.op.ITxnCreate.set_type_enum(algopy.TransactionType.ApplicationCall)
        algopy.op.ITxnCreate.set_on_completion(algopy.OnCompleteAction.DeleteApplication)
        algopy.op.ITxnCreate.set_approval_program(Bytes.from_hex("068101"))
        # pages essentially appends
        algopy.op.ITxnCreate.set_approval_program_pages(Bytes.from_hex("068101"))
        algopy.op.ITxnCreate.set_clear_state_program(Bytes.from_hex("068101"))
        algopy.op.ITxnCreate.set_fee(algopy.op.Global.min_txn_fee)
        algopy.op.ITxnCreate.next()
        algopy.op.ITxnCreate.set_type_enum(algopy.TransactionType.Payment)
        algopy.op.ITxnCreate.set_receiver(algopy.op.Global.creator_address)
        algopy.op.ITxnCreate.set_amount(algopy.UInt64(1000))
        algopy.op.ITxnCreate.submit()

        assert algopy.op.ITxn.receiver() == algopy.op.Global.creator_address
        assert algopy.op.ITxn.amount() == algopy.UInt64(1000)
        assert algopy.op.ITxn.type_enum() == algopy.TransactionType.Payment

        assert algopy.op.GITxn.type_enum(0) == algopy.TransactionType.ApplicationCall
        assert algopy.op.GITxn.type_enum(1) == algopy.TransactionType.Payment


class GlobalStateContract(ARC4Contract):
    def __init__(self) -> None:
        # Implicit key state variables
        self.implicit_key_arc4_uint = GlobalState(arc4.UInt64(1337))
        self.implicit_key_arc4_string = GlobalState(arc4.String("Hello"))
        self.implicit_key_arc4_byte = GlobalState(arc4.Byte(0))
        self.implicit_key_arc4_bool = GlobalState(arc4.Bool(True))
        self.implicit_key_arc4_address = GlobalState(arc4.Address(Global.creator_address))
        self.implicit_key_arc4_uint128 = GlobalState(arc4.UInt128(2**100))
        self.implicit_key_arc4_dynamic_bytes = GlobalState(arc4.DynamicBytes(b"dynamic bytes"))

        # Explicit key state variables
        self.arc4_uint = GlobalState(arc4.UInt64(1337), key="explicit_key_arc4_uint")
        self.arc4_string = GlobalState(arc4.String("Hello"), key="explicit_key_arc4_string")
        self.arc4_byte = GlobalState(arc4.Byte(0), key="explicit_key_arc4_byte")
        self.arc4_bool = GlobalState(arc4.Bool(True), key="explicit_key_arc4_bool")
        self.arc4_address = GlobalState(
            arc4.Address(Global.creator_address), key="explicit_key_arc4_address"
        )
        self.arc4_uint128 = GlobalState(arc4.UInt128(2**100), key="explicit_key_arc4_uint128")
        self.arc4_dynamic_bytes = GlobalState(
            arc4.DynamicBytes(b"dynamic bytes"), key="explicit_key_arc4_dynamic_bytes"
        )

    # Getter methods for implicit key state variables
    @arc4.abimethod()
    def get_implicit_key_arc4_uint(self) -> arc4.UInt64:
        return self.implicit_key_arc4_uint.value

    @arc4.abimethod()
    def get_implicit_key_arc4_string(self) -> arc4.String:
        return self.implicit_key_arc4_string.value

    @arc4.abimethod()
    def get_implicit_key_arc4_byte(self) -> arc4.Byte:
        return self.implicit_key_arc4_byte.value

    @arc4.abimethod()
    def get_implicit_key_arc4_bool(self) -> arc4.Bool:
        return self.implicit_key_arc4_bool.value

    @arc4.abimethod()
    def get_implicit_key_arc4_address(self) -> arc4.Address:
        return self.implicit_key_arc4_address.value

    @arc4.abimethod()
    def get_implicit_key_arc4_uint128(self) -> arc4.UInt128:
        return self.implicit_key_arc4_uint128.value

    @arc4.abimethod()
    def get_implicit_key_arc4_dynamic_bytes(self) -> arc4.DynamicBytes:
        return self.implicit_key_arc4_dynamic_bytes.value

    # Getter methods for explicit key state variables
    @arc4.abimethod()
    def get_arc4_uint(self) -> arc4.UInt64:
        return self.arc4_uint.value

    @arc4.abimethod()
    def get_arc4_string(self) -> arc4.String:
        return self.arc4_string.value

    @arc4.abimethod()
    def get_arc4_byte(self) -> arc4.Byte:
        return self.arc4_byte.value

    @arc4.abimethod()
    def get_arc4_bool(self) -> arc4.Bool:
        return self.arc4_bool.value

    @arc4.abimethod()
    def get_arc4_address(self) -> arc4.Address:
        return self.arc4_address.value

    @arc4.abimethod()
    def get_arc4_uint128(self) -> arc4.UInt128:
        return self.arc4_uint128.value

    @arc4.abimethod()
    def get_arc4_dynamic_bytes(self) -> arc4.DynamicBytes:
        return self.arc4_dynamic_bytes.value

    # Setter methods for implicit key state variables
    @arc4.abimethod()
    def set_implicit_key_arc4_uint(self, value: arc4.UInt64) -> None:
        self.implicit_key_arc4_uint.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_string(self, value: arc4.String) -> None:
        self.implicit_key_arc4_string.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_byte(self, value: arc4.Byte) -> None:
        self.implicit_key_arc4_byte.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_bool(self, value: arc4.Bool) -> None:
        self.implicit_key_arc4_bool.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_address(self, value: arc4.Address) -> None:
        self.implicit_key_arc4_address.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_uint128(self, value: arc4.UInt128) -> None:
        self.implicit_key_arc4_uint128.value = value

    @arc4.abimethod()
    def set_implicit_key_arc4_dynamic_bytes(self, value: arc4.DynamicBytes) -> None:
        self.implicit_key_arc4_dynamic_bytes.value = value.copy()

    # Setter methods for explicit key state variables
    @arc4.abimethod()
    def set_arc4_uint(self, value: arc4.UInt64) -> None:
        self.arc4_uint.value = value

    @arc4.abimethod()
    def set_arc4_string(self, value: arc4.String) -> None:
        self.arc4_string.value = value

    @arc4.abimethod()
    def set_arc4_byte(self, value: arc4.Byte) -> None:
        self.arc4_byte.value = value

    @arc4.abimethod()
    def set_arc4_bool(self, value: arc4.Bool) -> None:
        self.arc4_bool.value = value

    @arc4.abimethod()
    def set_arc4_address(self, value: arc4.Address) -> None:
        self.arc4_address.value = value

    @arc4.abimethod()
    def set_arc4_uint128(self, value: arc4.UInt128) -> None:
        self.arc4_uint128.value = value

    @arc4.abimethod()
    def set_arc4_dynamic_bytes(self, value: arc4.DynamicBytes) -> None:
        self.arc4_dynamic_bytes.value = value.copy()


class LocalStateContract(ARC4Contract):
    def __init__(self) -> None:
        # Implicit key state variables
        self.implicit_key_arc4_uint = LocalState(arc4.UInt64)
        self.implicit_key_arc4_string = LocalState(arc4.String)
        self.implicit_key_arc4_byte = LocalState(arc4.Byte)
        self.implicit_key_arc4_bool = LocalState(arc4.Bool)
        self.implicit_key_arc4_address = LocalState(arc4.Address)
        self.implicit_key_arc4_uint128 = LocalState(arc4.UInt128)
        self.implicit_key_arc4_dynamic_bytes = LocalState(arc4.DynamicBytes)

        # Explicit key state variables
        self.arc4_uint = LocalState(arc4.UInt64, key="explicit_key_arc4_uint")
        self.arc4_string = LocalState(arc4.String, key="explicit_key_arc4_string")
        self.arc4_byte = LocalState(arc4.Byte, key="explicit_key_arc4_byte")
        self.arc4_bool = LocalState(arc4.Bool, key="explicit_key_arc4_bool")
        self.arc4_address = LocalState(arc4.Address, key="explicit_key_arc4_address")
        self.arc4_uint128 = LocalState(arc4.UInt128, key="explicit_key_arc4_uint128")
        self.arc4_dynamic_bytes = LocalState(
            arc4.DynamicBytes, key="explicit_key_arc4_dynamic_bytes"
        )

    @arc4.abimethod(allow_actions=["OptIn"])
    def opt_in(self) -> None:
        self.implicit_key_arc4_uint[Global.creator_address] = arc4.UInt64(1337)
        self.implicit_key_arc4_string[Global.creator_address] = arc4.String("Hello")
        self.implicit_key_arc4_byte[Global.creator_address] = arc4.Byte(0)
        self.implicit_key_arc4_bool[Global.creator_address] = arc4.Bool(True)
        self.implicit_key_arc4_address[Global.creator_address] = arc4.Address(
            Global.creator_address
        )
        self.implicit_key_arc4_uint128[Global.creator_address] = arc4.UInt128(2**100)
        self.implicit_key_arc4_dynamic_bytes[Global.creator_address] = arc4.DynamicBytes(
            b"dynamic bytes"
        )

        self.arc4_uint[Global.creator_address] = arc4.UInt64(1337)
        self.arc4_string[Global.creator_address] = arc4.String("Hello")
        self.arc4_byte[Global.creator_address] = arc4.Byte(0)
        self.arc4_bool[Global.creator_address] = arc4.Bool(True)
        self.arc4_address[Global.creator_address] = arc4.Address(Global.creator_address)
        self.arc4_uint128[Global.creator_address] = arc4.UInt128(2**100)
        self.arc4_dynamic_bytes[Global.creator_address] = arc4.DynamicBytes(b"dynamic bytes")

    # Getter methods for implicit key state variables
    @arc4.abimethod()
    def get_implicit_key_arc4_uint(self, a: Account) -> arc4.UInt64:
        return self.implicit_key_arc4_uint[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_string(self, a: Account) -> arc4.String:
        return self.implicit_key_arc4_string[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_byte(self, a: Account) -> arc4.Byte:
        return self.implicit_key_arc4_byte[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_bool(self, a: Account) -> arc4.Bool:
        return self.implicit_key_arc4_bool[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_address(self, a: Account) -> arc4.Address:
        return self.implicit_key_arc4_address[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_uint128(self, a: Account) -> arc4.UInt128:
        return self.implicit_key_arc4_uint128[a]

    @arc4.abimethod()
    def get_implicit_key_arc4_dynamic_bytes(self, a: Account) -> arc4.DynamicBytes:
        return self.implicit_key_arc4_dynamic_bytes[a]

    # Getter methods for explicit key state variables
    @arc4.abimethod()
    def get_arc4_uint(self, a: Account) -> arc4.UInt64:
        return self.arc4_uint[a]

    @arc4.abimethod()
    def get_arc4_string(self, a: Account) -> arc4.String:
        return self.arc4_string[a]

    @arc4.abimethod()
    def get_arc4_byte(self, a: Account) -> arc4.Byte:
        return self.arc4_byte[a]

    @arc4.abimethod()
    def get_arc4_bool(self, a: Account) -> arc4.Bool:
        return self.arc4_bool[a]

    @arc4.abimethod()
    def get_arc4_address(self, a: Account) -> arc4.Address:
        return self.arc4_address[a]

    @arc4.abimethod()
    def get_arc4_uint128(self, a: Account) -> arc4.UInt128:
        return self.arc4_uint128[a]

    @arc4.abimethod()
    def get_arc4_dynamic_bytes(self, a: Account) -> arc4.DynamicBytes:
        return self.arc4_dynamic_bytes[a]
