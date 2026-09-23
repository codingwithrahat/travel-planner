package com.example.travelplanner.controller;

import com.example.travelplanner.service.TravelPlanService;
import com.example.travelplanner.model.TravelPlan;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/travel-planner")
public class TravelPlanController {

    private final TravelPlanService travelPlanService;

    // GET - All travel plans (sorted by recently added first)
    @GetMapping
    public String getAllTravelPlans(Model model) {
        List<TravelPlan> plans = travelPlanService.getAllTravelPlans();
        if (plans == null) {
            plans = List.of();
        }

        long ongoingCount = plans.stream()
                .filter(p -> p.getStatus() != null && "ONGOING".equalsIgnoreCase(p.getStatus()))
                .count();

        long plannedCount = plans.stream()
                .filter(p -> p.getStatus() != null && "PLANNED".equalsIgnoreCase(p.getStatus()))
                .count();

        double totalBudget = plans.stream()
                .mapToDouble(p -> p.getBudget() != null ? p.getBudget() : 0.0)
                .sum();

        model.addAttribute("travelPlans", plans);
        model.addAttribute("ongoingCount", ongoingCount);
        model.addAttribute("plannedCount", plannedCount);
        model.addAttribute("totalBudget", totalBudget);

        return "travel-planner";
    }

    // GET - Create form
    @GetMapping("/new")
    public String showCreateForm(Model model) {

        model.addAttribute("travelPlan", new TravelPlan());

        return "travel-plan-form";
    }

    // POST - Create
    @PostMapping
    public String createTravelPlan(
            @Valid @ModelAttribute("travelPlan") TravelPlan travelPlan,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "travel-plan-form";
        }

        travelPlanService.createTravelPlan(travelPlan);

        return "redirect:/travel-planner";
    }

    // GET - Update form
    @GetMapping("/edit/{id}")
    public String showUpdateForm(
            @PathVariable String id,
            Model model) {

        model.addAttribute(
                "travelPlan",
                travelPlanService.getTravelPlanById(id)
        );

        return "travel-plan-form";
    }

    // POST - Update
    @PostMapping("/update/{id}")
    public String updateTravelPlan(
            @PathVariable String id,
            @Valid @ModelAttribute("travelPlan") TravelPlan travelPlan,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "travel-plan-form";
        }

        travelPlanService.updateTravelPlan(id, travelPlan);

        return "redirect:/travel-planner";
    }

    // GET - View details
    @GetMapping("/{id}")
    public String getTravelPlanDetails(@PathVariable String id, Model model) {
        TravelPlan plan = travelPlanService.getTravelPlanById(id);

        double totalExpenses = 0.0;
        if (plan.getExpenses() != null) {
            totalExpenses = plan.getExpenses().stream()
                    .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                    .sum();
        }

        double budget = plan.getBudget() != null ? plan.getBudget() : 0.0;
        double budgetPercent = budget > 0.0 ? Math.min(100.0, (totalExpenses / budget) * 100.0) : 0.0;

        model.addAttribute("travelPlan", plan);
        model.addAttribute("totalExpenses", totalExpenses);
        model.addAttribute("budgetPercent", budgetPercent);

        return "travel-plan-details";
    }

    // POST - Delete
    @PostMapping("/delete/{id}")
    public String deleteTravelPlan(@PathVariable String id) {

        travelPlanService.deleteTravelPlan(id);

        return "redirect:/travel-planner";
    }
}

