import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

import subscriptionPlanService from "../../services/subscriptionPlan";
import subscriptionPlanOptionService from "../../services/subscriptionPlanOption";

import MembershipPlanModal from "../../components/MembershipPlanModal/MembershipPlanModal";
import MembershipOptionModal from "../../components/MembershipPlanOptionModal/MembershipPlanOptionModal";

import "./MembershipPlans.css";

function MembershipPlans() {
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /*
   * Membership Plan Modal
   */

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  /*
   * Membership Option Modal
   */

  const [optionModalOpen, setOptionModalOpen] =
    useState(false);

  const [selectedOptionPlan, setSelectedOptionPlan] =
    useState(null);

  /*
   * Expanded Membership Plans
   */

  const [expandedPlans, setExpandedPlans] =
    useState({});

  /*
   * Membership Options
   */

  const [planOptions, setPlanOptions] =
    useState({});

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);

      const response =
        await subscriptionPlanService.getAll();

      setPlans(response);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load membership plans."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * PLAN CRUD
   */

  function handleCreate() {
    setSelectedPlan(null);

    setModalOpen(true);
  }

  function handleEdit(plan) {
    setSelectedPlan(plan);

    setModalOpen(true);
  }

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Delete this membership plan?"
      );

    if (!confirmed) return;

    try {
      await subscriptionPlanService.delete(id);

      await loadPlans();
    } catch (err) {
      console.error(err);

      alert(
        "Unable to delete membership plan."
      );
    }
  }

  /*
   * Expand / Collapse
   */

  async function togglePlan(planId) {
    const expanded = expandedPlans[planId];

    if (expanded) {
      setExpandedPlans((prev) => ({
        ...prev,
        [planId]: false,
      }));

      return;
    }

    try {
      const options =
        await subscriptionPlanOptionService.getByPlan(
          planId
        );

      setPlanOptions((prev) => ({
        ...prev,
        [planId]: options,
      }));

      setExpandedPlans((prev) => ({
        ...prev,
        [planId]: true,
      }));
    } catch (err) {
      console.error(err);

      alert(
        "Unable to load membership options."
      );
    }
  }

  /*
   * Membership Option Modal
   */

  function handleAddOption(plan) {
    setSelectedOptionPlan(plan);

    setOptionModalOpen(true);
  }

  async function handleDeleteOption(optionId, planId) {
    const confirmed = window.confirm(
      "Delete this membership option?"
    );

    if (!confirmed) return;

    try {
      await subscriptionPlanOptionService.delete(optionId);

      // Reload options for this plan
      const options =
        await subscriptionPlanOptionService.getByPlan(planId);

      setPlanOptions((prev) => ({
        ...prev,
        [planId]: options,
      }));
    } catch (err) {
      console.error(err);

      alert("Unable to delete membership option.");
    }
  }

  /*
   * Search
   */

  const filteredPlans = plans.filter((plan) =>
    plan.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="membership-page">
        <div className="membership-loading">
          Loading Membership Plans...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="membership-page">
        <div className="membership-error">
          {error}
        </div>
      </div>
    );
  }
    return (
    <div className="membership-page">

      <div className="membership-header">

        <div>

          <h1>Membership Plans</h1>

          <p>
            Manage gym membership plans and their options.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={handleCreate}
        >
          <FiPlus />
          New Plan
        </button>

      </div>

      <div className="membership-toolbar">

        <div className="search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search membership plan..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="membership-table-wrapper">

        <table className="membership-table">

          <thead>

            <tr>

              <th></th>

              <th>Name</th>

              <th>Duration</th>

              <th className="actions-column">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredPlans.map((plan) => (
              <>
                <tr key={plan.id}>

                  <td
                    className="expand-column"
                    onClick={() =>
                      togglePlan(plan.id)
                    }
                  >
                    {expandedPlans[plan.id] ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </td>

                  <td>{plan.name}</td>

                  <td>
                    {plan.durationMonths === 0
                      ? "Single Session"
                      : `${plan.durationMonths} Month${plan.durationMonths > 1 ? "s" : ""}`}
                  </td>

                  <td className="actions">

                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleEdit(plan)
                      }
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() =>
                        handleDelete(plan.id)
                      }
                    >
                      <FiTrash2 />
                    </button>

                  </td>

                </tr>

                {expandedPlans[plan.id] && (
                  <tr className="options-row">

                    <td colSpan="4">

                      <div className="options-container">

                        <div className="options-header">

                          <h3>
                            Membership Options
                          </h3>

                          <button
                            className="primary-btn"
                            onClick={() =>
                              handleAddOption(
                                plan
                              )
                            }
                          >
                            <FiPlus />
                            Add Option
                          </button>

                        </div>

                        <table className="options-table">

                          <thead>

                            <tr>

                              <th>Option</th>

                              <th>Price</th>

                              <th>Actions</th>

                            </tr>

                          </thead>

                          <tbody>

                            {planOptions[
                              plan.id
                            ]?.length ? (
                              planOptions[
                                plan.id
                              ].map((option) => (
                                <tr
                                  key={option.id}
                                >

                                  <td>
                                    {option.optionType.replace(
                                      "_",
                                      " "
                                    )}
                                  </td>

                                  <td>
                                    {Number(
                                      option.price
                                    ).toLocaleString()}
                                  </td>

                                  <td className="actions">

                                    <button
                                      className="icon-btn delete"
                                      onClick={() =>
                                        handleDeleteOption(
                                          option.id,
                                          plan.id
                                        )
                                      }
                                    >
                                      <FiTrash2 />
                                    </button>

                                  </td>

                                </tr>
                              ))
                            ) : (
                              <tr>

                                <td
                                  colSpan="3"
                                  className="empty-options"
                                >
                                  No membership
                                  options found.
                                </td>

                              </tr>
                            )}

                          </tbody>

                        </table>

                      </div>

                    </td>

                  </tr>
                )}
              </>
            ))}
                      </tbody>
        </table>
      </div>

      <MembershipPlanModal
        open={modalOpen}
        plan={selectedPlan}
        onClose={() => {
          setModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={async () => {
          setModalOpen(false);
          setSelectedPlan(null);
          await loadPlans();
        }}
      />

      <MembershipOptionModal
        open={optionModalOpen}
        membershipPlan={selectedOptionPlan}
        onClose={() => {
          setOptionModalOpen(false);
          setSelectedOptionPlan(null);
        }}
        onSuccess={async () => {
          const planId = selectedOptionPlan?.id;

          setOptionModalOpen(false);
          setSelectedOptionPlan(null);

          if (planId) {
            try {
              const options =
                await subscriptionPlanOptionService.getByPlan(planId);

              setPlanOptions((prev) => ({
                ...prev,
                [planId]: options,
              }));
            } catch (err) {
              console.error(err);
            }
          }
        }}
      />
    </div>
  );
}

export default MembershipPlans;