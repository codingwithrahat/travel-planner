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

    // GET - All travel plans
    @GetMapping
    public String getAllTravelPlans(Model model) {

        model.addAttribute(
                "travelPlans",
                travelPlanService.getAllTravelPlans()
        );

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
        model.addAttribute("travelPlan", travelPlanService.getTravelPlanById(id));
        return "travel-plan-details";
    }

    // POST - Delete
    @PostMapping("/delete/{id}")
    public String deleteTravelPlan(@PathVariable String id) {

        travelPlanService.deleteTravelPlan(id);

        return "redirect:/travel-planner";
    }
}

