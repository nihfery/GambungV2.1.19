// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GamboengTraceability is Ownable {

    /* =============================================================
                                ENUM
    ============================================================= */
    enum Step {
        Plucking,
        Withering,
        Rolling,
        WrappingHeaping,
        PartialOxidation,
        Oxidation,
        Fermentation,
        Drying,
        Roasting,
        Aging,
        Pressing,
        Packing
    }

    /* =============================================================
                                ACTOR
    ============================================================= */
    struct Actor {
        string name;
        string status;
        bool active;
    }

    mapping(address => Actor) public actors;

    // ✅ ACTOR REGISTRY (NEW)
    address[] private actorList;
    mapping(address => bool) private actorExists;

    /* =============================================================
                                ROLE
    ============================================================= */
    mapping(Step => mapping(address => bool)) public hasRole;
    mapping(address => Step[]) private actorRoles;
    mapping(address => mapping(Step => bool)) private hasActorRole;

    /* =============================================================
                                LOT
    ============================================================= */
    struct Lot {
        string id;
        Step step;
        address actor;
        uint256 quantity;
        string[] parentIds;
        string meta;
        bool exists;
        bool finished;
        uint256 timestamp;
    }

    mapping(string => Lot) public lots;
    string[] private allLotIds;

    /* =============================================================
                              TRANSFER
    ============================================================= */
    struct Transfer {
        string id;
        string[] lotIds;
        address from;
        address to;
        Step toStep;
        uint256 quantity;
        bool accepted;
        bool cancelled;
        uint256 timestamp;
        uint256 acceptedAt;
    }

    mapping(string => Transfer) public transfers;
    string[] private allTransferIds;

    uint256 public lotCount;
    uint256 public transferCount;
    uint256 public finishedCount;

    /* =============================================================
                                EVENTS
    ============================================================= */
    event ActorRegistered(address actor, string name, string status);
    event ActorStatusChanged(address actor, bool active);

    event RoleGranted(address actor, Step step);
    event RoleRevoked(address actor, Step step);

    event LotCreated(
        string lotId,
        Step step,
        address actor,
        uint256 qty,
        string meta
    );

    event TransferProposed(
        string transferId,
        address from,
        address to,
        Step step,
        uint256 qty
    );

    event TransferAccepted(string transferId, string newLotId);
    event TransferCancelled(string transferId);

    constructor() Ownable(msg.sender) {}

    /* =============================================================
                          ACTOR MANAGEMENT
    ============================================================= */
    function setActor(
        address account,
        string calldata name,
        string calldata status,
        bool active
    ) external onlyOwner {

        // ✅ SIMPAN ACTOR SEKALI SAJA
        if (!actorExists[account]) {
            actorExists[account] = true;
            actorList.push(account);
        }

        actors[account] = Actor(name, status, active);

        emit ActorRegistered(account, name, status);
        emit ActorStatusChanged(account, active);
    }

    function getAllActors() external view returns (address[] memory) {
        return actorList;
    }

    /* =============================================================
                          ROLE MANAGEMENT
    ============================================================= */
    function grantRole(Step step, address account) external onlyOwner {
        require(actors[account].active, "actor not active");
        require(!hasActorRole[account][step], "role exists");

        hasRole[step][account] = true;
        hasActorRole[account][step] = true;
        actorRoles[account].push(step);

        emit RoleGranted(account, step);
    }

    function revokeRole(Step step, address account) external onlyOwner {
        require(hasActorRole[account][step], "role not assigned");

        hasRole[step][account] = false;
        hasActorRole[account][step] = false;

        Step[] storage roles = actorRoles[account];
        for (uint256 i = 0; i < roles.length; i++) {
            if (roles[i] == step) {
                roles[i] = roles[roles.length - 1];
                roles.pop();
                break;
            }
        }

        emit RoleRevoked(account, step);
    }

    function getRolesByActor(address account)
        external
        view
        returns (Step[] memory)
    {
        return actorRoles[account];
    }

    function canLogin(address account) external view returns (bool) {
        if (account == owner()) return true;
        if (!actors[account].active) return false;
        if (actorRoles[account].length == 0) return false;
        return true;
    }

    /* =============================================================
                          STEP RULE
    ============================================================= */
    function _isAllowed(Step from, Step to) internal pure returns (bool) {
        if (from == Step.Plucking && to == Step.Withering) return true;
        if (from == Step.Withering && (to == Step.Rolling || to == Step.Drying)) return true;
        if (from == Step.Rolling) return true;
        if (from == Step.Drying && (to == Step.Packing || to == Step.Roasting || to == Step.Aging)) return true;
        if (from == Step.Roasting && to == Step.Packing) return true;
        if (from == Step.Aging && to == Step.Pressing) return true;
        if (from == Step.Pressing && to == Step.Packing) return true;
        return false;
    }

    /* =============================================================
                              LOT
    ============================================================= */
    function createPluckingLot(
        string calldata lotId,
        uint256 qty,
        string calldata meta
    ) external {
        require(!lots[lotId].exists, "duplicate lot");
        require(hasRole[Step.Plucking][msg.sender] || msg.sender == owner(), "no role");

        string[] memory empty;

        lots[lotId] = Lot(
            lotId,
            Step.Plucking,
            msg.sender,
            qty,
            empty,
            meta,
            true,
            false,
            block.timestamp
        );

        allLotIds.push(lotId);
        lotCount++;

        emit LotCreated(lotId, Step.Plucking, msg.sender, qty, meta);
    }

    function getAllLotIds() external view returns (string[] memory) {
        return allLotIds;
    }

    /* =============================================================
                          TRANSFER PROCESS
    ============================================================= */
    function proposeTransfer(
        string calldata transferId,
        string[] calldata lotIds,
        address to,
        Step toStep,
        uint256 qty
    ) external {
        require(bytes(transfers[transferId].id).length == 0, "duplicate transfer");
        require(hasRole[toStep][to] || to == owner(), "receiver no role");

        uint256 totalQty;
        for (uint256 i = 0; i < lotIds.length; i++) {
            Lot storage L = lots[lotIds[i]];
            require(L.exists, "lot not found");
            require(L.actor == msg.sender || msg.sender == owner(), "not owner");
            require(_isAllowed(L.step, toStep), "invalid step");
            totalQty += L.quantity;
        }

        require(qty <= totalQty, "qty invalid");

        transfers[transferId] = Transfer(
            transferId,
            lotIds,
            msg.sender,
            to,
            toStep,
            qty,
            false,
            false,
            block.timestamp,
            0
        );

        allTransferIds.push(transferId);
        transferCount++;

        emit TransferProposed(transferId, msg.sender, to, toStep, qty);
    }

    function getAllTransferIds() external view returns (string[] memory) {
        return allTransferIds;
    }

    function getTransfer(string calldata transferId)
        external
        view
        returns (Transfer memory)
    {
        return transfers[transferId];
    }

    function acceptTransfer(
        string calldata transferId,
        string calldata newLotId,
        string calldata meta
    ) external {
        Transfer storage T = transfers[transferId];

        require(!T.accepted && !T.cancelled, "handled");
        require(T.to == msg.sender || msg.sender == owner(), "not receiver");
        require(!lots[newLotId].exists, "duplicate lot");

        uint256 remaining = T.quantity;

        for (uint256 i = 0; i < T.lotIds.length && remaining > 0; i++) {
            Lot storage src = lots[T.lotIds[i]];
            uint256 take = src.quantity >= remaining ? remaining : src.quantity;
            src.quantity -= take;
            if (src.quantity == 0) src.finished = true;
            remaining -= take;
        }

        bool isFinal = (T.toStep == Step.Packing);

        lots[newLotId] = Lot(
            newLotId,
            T.toStep,
            msg.sender,
            T.quantity,
            T.lotIds,
            meta,
            true,
            isFinal,
            block.timestamp
        );

        allLotIds.push(newLotId);
        lotCount++;
        if (isFinal) finishedCount++;

        T.accepted = true;
        T.acceptedAt = block.timestamp;

        emit TransferAccepted(transferId, newLotId);
    }

    // ✅ FIX: CANCEL HANYA RECEIVER / OWNER
    function cancelTransfer(string calldata transferId) external {
        Transfer storage T = transfers[transferId];

        require(!T.accepted && !T.cancelled, "handled");
        require(T.to == msg.sender || msg.sender == owner(), "not receiver");

        T.cancelled = true;
        emit TransferCancelled(transferId);
    }

    /* =============================================================
                              TRACE
    ============================================================= */
    struct LotView {
        string id;
        Step step;
        address actor;
        uint256 quantity;
        string[] parentIds;
        string meta;
        bool finished;
        uint256 timestamp;
    }

    function traceLot(string calldata lotId)
        external
        view
        returns (LotView[] memory)
    {
        require(lots[lotId].exists, "not found");

        uint256 total = _countAncestors(lotId);
        LotView[] memory chain = new LotView[](total);
        _fillAncestors(lotId, chain, 0);
        return chain;
    }

    function _countAncestors(string memory lotId) internal view returns (uint256) {
        uint256 sum = 1;
        for (uint256 i = 0; i < lots[lotId].parentIds.length; i++) {
            sum += _countAncestors(lots[lotId].parentIds[i]);
        }
        return sum;
    }

    function _fillAncestors(
        string memory lotId,
        LotView[] memory arr,
        uint256 index
    ) internal view returns (uint256) {
        Lot storage L = lots[lotId];

        arr[index++] = LotView(
            L.id,
            L.step,
            L.actor,
            L.quantity,
            L.parentIds,
            L.meta,
            L.finished,
            L.timestamp
        );

        for (uint256 i = 0; i < L.parentIds.length; i++) {
            index = _fillAncestors(L.parentIds[i], arr, index);
        }
        return index;
    }
}
